import { NextResponse } from 'next/server';
import { PinataSDK } from "pinata-web3";

const pinata = new PinataSDK({
    pinataJwt: process.env.PINATA_JWT,
    pinataGateway: process.env.PINATA_GATEWAY
});

export async function POST(request) {
    try {
        const data = await request.json();
        
        const file = new File(
            [JSON.stringify(data)],
            "data.json",
            { type: "application/json" }
        );
        
        const upload = await pinata.upload.file(file);
        
        return NextResponse.json({ 
            success: true, 
            ipfsHash: upload.IpfsHash 
        });

    } catch (error) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

export async function GET() {
    return NextResponse.json({ status: 'API is running' });
}