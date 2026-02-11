import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { OmadaClient } from '../omada/client.js';

export function registerDeviceTools(server: McpServer, client: OmadaClient) {
  server.tool(
    'omada_list_devices',
    'List devices in a site. Can filter by type: ap, switch, gateway.',
    {
      siteId: z.string().describe('Site ID'),
      type: z.string().optional().describe('Device type filter: "ap", "switch", or "gateway"'),
      page: z.number().optional().describe('Page number (default: 1)'),
      pageSize: z.number().optional().describe('Items per page (default: 100)'),
    },
    { readOnlyHint: true, destructiveHint: false, openWorldHint: true },
    async ({ siteId, type, page, pageSize }) => {
      const result = await client.listDevices(siteId, type, page, pageSize);
      return {
        content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
      };
    },
  );

  server.tool(
    'omada_get_device',
    'Get detailed information about a specific device by MAC address.',
    {
      siteId: z.string().describe('Site ID'),
      deviceMac: z.string().describe('Device MAC address'),
    },
    { readOnlyHint: true, destructiveHint: false, openWorldHint: true },
    async ({ siteId, deviceMac }) => {
      const result = await client.getDevice(siteId, deviceMac);
      return {
        content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
      };
    },
  );

  server.tool(
    'omada_device_action',
    'Perform an action on a device: reboot or adopt.',
    {
      siteId: z.string().describe('Site ID'),
      deviceMac: z.string().describe('Device MAC address'),
      action: z.enum(['reboot', 'adopt']).describe('Action to perform'),
    },
    { readOnlyHint: false, destructiveHint: true, openWorldHint: true },
    async ({ siteId, deviceMac, action }) => {
      if (action === 'reboot') {
        await client.rebootDevice(siteId, deviceMac);
        return {
          content: [{ type: 'text' as const, text: `Device ${deviceMac} is rebooting.` }],
        };
      }
      await client.adoptDevice(siteId, deviceMac);
      return {
        content: [{ type: 'text' as const, text: `Device ${deviceMac} adoption initiated.` }],
      };
    },
  );
}
