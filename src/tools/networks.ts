import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { OmadaClient } from '../omada/client.js';

export function registerNetworkTools(server: McpServer, client: OmadaClient) {
  server.tool(
    'omada_list_wlans',
    'List wireless networks (WLANs/SSIDs) in a site.',
    {
      siteId: z.string().describe('Site ID'),
    },
    { readOnlyHint: true, destructiveHint: false, openWorldHint: true },
    async ({ siteId }) => {
      const result = await client.listWlans(siteId);
      return {
        content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
      };
    },
  );

  server.tool(
    'omada_list_lans',
    'List LAN networks in a site.',
    {
      siteId: z.string().describe('Site ID'),
    },
    { readOnlyHint: true, destructiveHint: false, openWorldHint: true },
    async ({ siteId }) => {
      const result = await client.listLans(siteId);
      return {
        content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
      };
    },
  );

  server.tool(
    'omada_get_wan',
    'Get WAN/internet settings for a site.',
    {
      siteId: z.string().describe('Site ID'),
    },
    { readOnlyHint: true, destructiveHint: false, openWorldHint: true },
    async ({ siteId }) => {
      const result = await client.getWan(siteId);
      return {
        content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
      };
    },
  );
}
