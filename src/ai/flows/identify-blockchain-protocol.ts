'use server';

/**
 * @fileOverview Helps users select the correct blockchain protocol based on their needs.
 *
 * - identifyBlockchainProtocol - A function that handles the protocol identification process.
 * - IdentifyBlockchainProtocolInput - The input type for the identifyBlockchainProtocol function.
 * - IdentifyBlockchainProtocolOutput - The return type for the identifyBlockchainProtocol function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IdentifyBlockchainProtocolInputSchema = z.object({
  needs: z
    .string()
    .describe(
      'A description of the users needs. Be specific about what the user is trying to build.'
    ),
});
export type IdentifyBlockchainProtocolInput = z.infer<
  typeof IdentifyBlockchainProtocolInputSchema
>;

const IdentifyBlockchainProtocolOutputSchema = z.object({
  protocol: z
    .string()
    .describe('The recommended blockchain protocol based on the user needs.'),
  reason: z
    .string()
    .describe('The reason why this protocol is recommended.'),
});
export type IdentifyBlockchainProtocolOutput = z.infer<
  typeof IdentifyBlockchainProtocolOutputSchema
>;

export async function identifyBlockchainProtocol(
  input: IdentifyBlockchainProtocolInput
): Promise<IdentifyBlockchainProtocolOutput> {
  return identifyBlockchainProtocolFlow(input);
}

const prompt = ai.definePrompt({
  name: 'identifyBlockchainProtocolPrompt',
  input: {schema: IdentifyBlockchainProtocolInputSchema},
  output: {schema: IdentifyBlockchainProtocolOutputSchema},
  prompt: `You are an expert in blockchain protocols. A user is trying to select the best blockchain protocol for their needs.

Given the users needs, recommend a blockchain protocol and explain why it is the best choice.

User needs: {{{needs}}}

Consider these protocols:
Ethereum, Avalanche, Binance, Fantom, Tron, Coreum, Polkadot, Polygon, Provenance, Optimism, Arbitrum, Base, Celestia, Centrifuge, Etherlink, Gnosis, Tezos, Solana, Flow, XDC, Near, Flare Chain, Coti, Subsquid, Injective, Glue, Nillion, Kilt Unit, Theta, Stellar, RPC, Skale

Return the protocol and the reason in the format specified by the output schema. Focus on the technical capabilities of the protocol.
`,
});

const identifyBlockchainProtocolFlow = ai.defineFlow(
  {
    name: 'identifyBlockchainProtocolFlow',
    inputSchema: IdentifyBlockchainProtocolInputSchema,
    outputSchema: IdentifyBlockchainProtocolOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
