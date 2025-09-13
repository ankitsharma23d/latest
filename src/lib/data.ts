import { collection, getDocs } from 'firebase/firestore';
import type { SupportRequest } from '@/lib/types';
import { db } from '@/lib/firebase';
import {
    Hexagon,
    Boxes,
    Network,
    Component,
    CloudCog,
    Link,
    Share2,
    Database,
    Binary,
    Shield,
    GitBranchPlus,
    Layers,
    Server,
    Zap,
    Cpu,
    Key,
    Package
} from 'lucide-react';

export const PROTOCOLS = [
  { name: 'Ethereum', icon: Hexagon },
  { name: 'Avalanche', icon: Boxes },
  { name: 'Binance', icon: Network },
  { name: 'Fantom', icon: Component },
  { name: 'Tron', icon: CloudCog },
  { name: 'Coreum', icon: Link },
  { name: 'Polkadot', icon: Share2 },
  { name: 'Polygon', icon: Database },
  { name: 'Provenance', icon: Binary },
  { name: 'Optimism', icon: Shield },
  { name: 'Arbitrum', icon: GitBranchPlus },
  { name: 'Base', icon: Layers },
  { name: 'Celestia', icon: Server },
  { name: 'Centrifuge', icon: Zap },
  { name: 'Etherlink', icon: Link },
  { name: 'Gnosis', icon: Hexagon },
  { name: 'Tezos', icon: Boxes },
  { name: 'Solana', icon: Network },
  { name: 'Flow', icon: Component },
  { name: 'XDC', icon: CloudCog },
  { name: 'Near', icon: Link },
  { name: 'Flare Chain', icon: Share2 },
  { name: 'Coti', icon: Database },
  { name: 'Subsquid', icon: Binary },
  { name: 'Injective', icon: Shield },
  { name: 'Glue', icon: GitBranchPlus },
  { name: 'Nillion', icon: Layers },
  { name: 'Kilt', icon: Key },
  { name: 'Unit', icon: Package },
  { name: 'Theta', icon: Zap },
  { name: 'Stellar', icon: Hexagon },
  { name: 'RPC', icon: Cpu },
  { name: 'Skale', icon: Network },
];

export async function getSupportRequests(): Promise<SupportRequest[]> {
    const requestsCol = collection(db, 'requests');
    const requestSnapshot = await getDocs(requestsCol);
    const requestsList = requestSnapshot.docs.map(doc => {
        const data = doc.data();
        const timestamp = data.timestamp && typeof data.timestamp.toDate === 'function' 
            ? data.timestamp.toDate().toLocaleDateString() 
            : 'N/A';
        return {
            id: doc.id,
            name: data.name,
            email: data.email,
            type: data.type,
            message: data.message,
            timestamp: timestamp,
            status: data.status,
            protocol: data.protocol,
            otherProtocol: data.otherProtocol,
            networkType: data.networkType,
            otherNetworkType: data.otherNetworkType,
            nodeType: data.nodeType,
            otherNodeType: data.otherNodeType,
        } as SupportRequest;
    });
    return requestsList;
}
