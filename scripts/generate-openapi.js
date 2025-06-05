#!/usr/bin/env node

/**
 * Script para generar OpenAPI spec desde contratos Solidity
 * Uso: node scripts/generate-openapi.js
 */

const fs = require('fs');
const path = require('path');

// Configuración base
const config = {
  openapi: "3.0.3",
  info: {
    title: "VCOP Protocol API",
    version: "2.0.0",
    description: "Advanced DeFi Lending Protocol with Hybrid Architecture",
    termsOfService: "https://vcop.finance/terms",
    contact: {
      name: "VCOP Team",
      url: "https://vcop.finance",
      email: "dev@vcop.finance"
    },
    license: {
      name: "MIT",
      url: "https://opensource.org/licenses/MIT"
    }
  },
  servers: [
    {
      url: "https://api.vcop.finance/v2",
      description: "Production server"
    },
    {
      url: "https://testnet-api.vcop.finance/v2", 
      description: "Testnet server"
    }
  ],
  paths: {},
  components: {
    schemas: {},
    securitySchemes: {
      ApiKeyAuth: {
        type: "apiKey",
        in: "header",
        name: "X-API-Key"
      },
      BearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT"
      }
    }
  }
};

// Función para leer ABIs de contratos compilados
function readContractABIs() {
  const abiDir = path.join(__dirname, '../out');
  const contracts = {};
  
  // Leer ABIs principales
  const mainContracts = [
    'VCOPCollateralized',
    'VCOPCollateralManager', 
    'VCOPHealthManager',
    'VCOPLiquidationEngine',
    'VCOPFlashLoan',
    'VCOPOracle'
  ];
  
  mainContracts.forEach(contractName => {
    try {
      const abiPath = path.join(abiDir, `${contractName}.sol/${contractName}.json`);
      if (fs.existsSync(abiPath)) {
        const contractData = JSON.parse(fs.readFileSync(abiPath, 'utf8'));
        contracts[contractName] = contractData.abi;
      }
    } catch (error) {
      console.warn(`Could not read ABI for ${contractName}:`, error.message);
    }
  });
  
  return contracts;
}

// Función para convertir función Solidity a endpoint OpenAPI
function solidityFunctionToOpenAPI(contractName, func, methodType = 'post') {
  const functionName = func.name;
  const path = `/contracts/${contractName.toLowerCase()}/${functionName}`;
  
  // Generar parámetros
  const parameters = func.inputs.map(input => ({
    name: input.name,
    type: mapSolidityTypeToOpenAPI(input.type),
    required: true,
    description: `${input.name} parameter of type ${input.type}`
  }));
  
  // Generar respuesta
  const responses = {
    "200": {
      description: "Transaction successful",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean" },
              transactionHash: { type: "string" },
              gasUsed: { type: "string" },
              ...(func.outputs && func.outputs.length > 0 && {
                result: {
                  type: "object",
                  properties: func.outputs.reduce((acc, output, index) => {
                    acc[output.name || `output${index}`] = {
                      type: mapSolidityTypeToOpenAPI(output.type)
                    };
                    return acc;
                  }, {})
                }
              })
            }
          }
        }
      }
    },
    "400": {
      description: "Invalid parameters",
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/Error"
          }
        }
      }
    },
    "500": {
      description: "Transaction failed",
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/Error"
          }
        }
      }
    }
  };
  
  return {
    [methodType]: {
      tags: [contractName],
      summary: `${functionName} - ${contractName}`,
      description: `Execute ${functionName} function on ${contractName} contract`,
      requestBody: methodType === 'post' ? {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                from: {
                  type: "string",
                  description: "Sender address"
                },
                ...parameters.reduce((acc, param) => {
                  acc[param.name] = {
                    type: param.type,
                    description: param.description
                  };
                  return acc;
                }, {})
              },
              required: ["from", ...parameters.map(p => p.name)]
            }
          }
        }
      } : undefined,
      parameters: methodType === 'get' ? parameters.map(p => ({
        name: p.name,
        in: "query",
        required: p.required,
        schema: { type: p.type },
        description: p.description
      })) : undefined,
      responses,
      security: [{ "BearerAuth": [] }]
    }
  };
}

// Mapear tipos Solidity a OpenAPI
function mapSolidityTypeToOpenAPI(solidityType) {
  if (solidityType.includes('uint') || solidityType.includes('int')) {
    return 'string'; // Usamos string para números grandes
  }
  if (solidityType === 'bool') {
    return 'boolean';
  }
  if (solidityType === 'address') {
    return 'string';
  }
  if (solidityType === 'bytes' || solidityType.includes('bytes')) {
    return 'string';
  }
  if (solidityType.includes('[]')) {
    return 'array';
  }
  return 'string';
}

// Generar paths de contratos
function generateContractPaths(contracts) {
  const paths = {};
  
  Object.entries(contracts).forEach(([contractName, abi]) => {
    abi.forEach(item => {
      if (item.type === 'function' && item.stateMutability !== 'pure') {
        const path = `/contracts/${contractName.toLowerCase()}/${item.name}`;
        const method = item.stateMutability === 'view' ? 'get' : 'post';
        
        paths[path] = solidityFunctionToOpenAPI(contractName, item, method);
      }
    });
  });
  
  return paths;
}

// Agregar paths adicionales de API
function addApiPaths() {
  return {
    "/health": {
      get: {
        tags: ["System"],
        summary: "Health check",
        description: "Check API health status",
        responses: {
          "200": {
            description: "API is healthy",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string" },
                    timestamp: { type: "string" },
                    version: { type: "string" }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/positions/{userAddress}": {
      get: {
        tags: ["Positions"],
        summary: "Get user positions",
        description: "Retrieve all positions for a user",
        parameters: [
          {
            name: "userAddress",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "User's Ethereum address"
          }
        ],
        responses: {
          "200": {
            description: "User positions",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/Position"
                  }
                }
              }
            }
          }
        }
      }
    },
    "/liquidations": {
      get: {
        tags: ["Liquidations"],
        summary: "Get liquidation opportunities",
        description: "Retrieve current liquidation opportunities",
        parameters: [
          {
            name: "minProfit",
            in: "query",
            schema: { type: "string" },
            description: "Minimum profit threshold"
          }
        ],
        responses: {
          "200": {
            description: "Liquidation opportunities",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/LiquidationOpportunity"
                  }
                }
              }
            }
          }
        }
      }
    }
  };
}

// Definir schemas comunes
function addSchemas() {
  return {
    Error: {
      type: "object",
      properties: {
        error: { type: "string" },
        message: { type: "string" },
        code: { type: "integer" }
      }
    },
    Position: {
      type: "object",
      properties: {
        id: { type: "string" },
        user: { type: "string" },
        collateralToken: { type: "string" },
        collateralAmount: { type: "string" },
        vcopMinted: { type: "string" },
        healthFactor: { type: "string" },
        liquidationThreshold: { type: "string" }
      }
    },
    LiquidationOpportunity: {
      type: "object",
      properties: {
        user: { type: "string" },
        positionId: { type: "string" },
        healthFactor: { type: "string" },
        collateralValue: { type: "string" },
        debtValue: { type: "string" },
        expectedProfit: { type: "string" },
        liquidationBonus: { type: "string" }
      }
    }
  };
}

// Función principal
function generateOpenAPISpec() {
  console.log('🚀 Generating OpenAPI specification...');
  
  // Leer contratos
  const contracts = readContractABIs();
  console.log(`📄 Found ${Object.keys(contracts).length} contracts`);
  
  // Generar paths
  const contractPaths = generateContractPaths(contracts);
  const apiPaths = addApiPaths();
  
  // Combinar configuración
  const spec = {
    ...config,
    paths: {
      ...contractPaths,
      ...apiPaths
    },
    components: {
      ...config.components,
      schemas: {
        ...config.components.schemas,
        ...addSchemas()
      }
    }
  };
  
  // Escribir archivos
  const outputDir = path.join(__dirname, '../docs/api');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // OpenAPI spec en inglés
  fs.writeFileSync(
    path.join(outputDir, 'openapi-en.json'),
    JSON.stringify(spec, null, 2)
  );
  
  // OpenAPI spec en español (traducir títulos y descripciones)
  const specES = translateToSpanish(spec);
  fs.writeFileSync(
    path.join(outputDir, 'openapi-es.json'),
    JSON.stringify(specES, null, 2)
  );
  
  console.log('✅ OpenAPI specifications generated:');
  console.log('   📁 docs/api/openapi-en.json (English)');
  console.log('   📁 docs/api/openapi-es.json (Spanish)');
  
  return spec;
}

// Función para traducir a español
function translateToSpanish(spec) {
  const spanishSpec = JSON.parse(JSON.stringify(spec)); // Deep clone
  
  // Traducir info
  spanishSpec.info.title = "API del Protocolo VCOP";
  spanishSpec.info.description = "Protocolo DeFi de Préstamos Avanzado con Arquitectura Híbrida";
  
  // Traducir servers
  spanishSpec.servers[0].description = "Servidor de producción";
  spanishSpec.servers[1].description = "Servidor de testnet";
  
  // Traducir tags y descriptions (implementación básica)
  Object.keys(spanishSpec.paths).forEach(path => {
    Object.keys(spanishSpec.paths[path]).forEach(method => {
      const operation = spanishSpec.paths[path][method];
      
      // Traducir summaries y descriptions básicas
      if (operation.summary) {
        operation.summary = operation.summary.replace(/Execute/, 'Ejecutar');
        operation.summary = operation.summary.replace(/Get/, 'Obtener');
        operation.summary = operation.summary.replace(/Check/, 'Verificar');
      }
      
      if (operation.description) {
        operation.description = operation.description.replace(/Execute/, 'Ejecutar');
        operation.description = operation.description.replace(/Retrieve/, 'Obtener');
        operation.description = operation.description.replace(/Check/, 'Verificar');
      }
    });
  });
  
  return spanishSpec;
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  try {
    generateOpenAPISpec();
  } catch (error) {
    console.error('❌ Error generating OpenAPI spec:', error);
    process.exit(1);
  }
}

module.exports = { generateOpenAPISpec }; 