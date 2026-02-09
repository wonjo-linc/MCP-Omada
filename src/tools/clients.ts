import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { OmadaClient } from '../omada/client.js';

export function registerClientTools(server: McpServer, client: OmadaClient) {
  server.tool(
    'omada_list_clients',
    'List connected clients in a site.',
    {
      siteId: z.string().describe('Site ID'),
      page: z.number().optional().describe('Page number (default: 1)'),
      pageSize: z.number().optional().describe('Items per page (default: 100)'),
    },
    async ({ siteId, page, pageSize }) => {
      const result = await client.listClients(siteId, page, pageSize);
      return {
        content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
      };
    },
  );

  server.tool(
    'omada_get_client',
    'Get detailed information about a specific client by MAC address.',
    {
      siteId: z.string().describe('Site ID'),
      clientMac: z.string().describe('Client MAC address'),
    },
    async ({ siteId, clientMac }) => {
      const result = await client.getClient(siteId, clientMac);
      return {
        content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
      };
    },
  );

  server.tool(
    'omada_client_action',
    'Perform an action on a client: block, unblock.',
    {
      siteId: z.string().describe('Site ID'),
      clientMac: z.string().describe('Client MAC address'),
      action: z.enum(['block', 'unblock']).describe('Action to perform'),
    },
    async ({ siteId, clientMac, action }) => {
      if (action === 'block') {
        await client.blockClient(siteId, clientMac);
        return {
          content: [{ type: 'text' as const, text: `Client ${clientMac} has been blocked.` }],
        };
      }
      await client.unblockClient(siteId, clientMac);
      return {
        content: [{ type: 'text' as const, text: `Client ${clientMac} has been unblocked.` }],
      };
    },
  );
}
