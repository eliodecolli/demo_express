import { config } from "dotenv";
import { readFileSync } from "fs";
import { sign } from "jsonwebtoken";
import { dataSource } from "./baseSql";

interface Environment { 
    privateKey?: Buffer,
    publicKey?: Buffer,
    Setup: boolean;
}

export const ENV: Environment = {
    privateKey: undefined,
    publicKey: undefined,

    Setup: false
}

export async function createJwt(payload: Object | string): Promise<string> {
    //@ts-ignore - ENV is checked via middleware
    return await sign(payload, ENV.privateKey)
}


export default async function setup() {
    const privKey: Buffer = readFileSync('private_key.key')
    const pubKey: Buffer = readFileSync('public_key.key')

    ENV.privateKey = privKey
    // {
    //     key: privKey,
    //     passphrase: 'shit'
    // }

    ENV.publicKey = pubKey
    // {
    //     key: pubKey,
    //     passphrase: 'publicshit'
    // }

    config()

    await dataSource.initialize()
    ENV.Setup = true
}