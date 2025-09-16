import type { Config } from 'jest';


const config: Config = {
preset: 'ts-jest',
testEnvironment: 'jsdom',
setupFilesAfterEnv: ['<rootDir>/setupTests.ts'],
moduleNameMapper: {
'^@/(.*)$': '<rootDir>/src/$1',
'\\.(css|scss)$': 'identity-obj-proxy'
},
transform: {
'^.+\\.(ts|tsx)$': [
'ts-jest',
{ tsconfig: '<rootDir>/tsconfig.json', isolatedModules: true }
],
},
};
export default config;