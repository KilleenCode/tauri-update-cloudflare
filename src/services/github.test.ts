import { describe, it, expect } from 'vitest';
import {
    getReleases,
    getLatestRelease,
    findAssetSignature,
    Asset
} from './github';
import { Env } from '../../worker-configuration';

const IncomingRequest = Request<unknown, IncomingRequestCfProperties>;

// Mock the Env object
const env: Env = {
    GITHUB_ACCOUNT: 'killeencode',
    GITHUB_REPO: 'brancato'
};

describe('github', () => {
    it('getReleases', async () => {
        const request = new IncomingRequest('http://example.com');
        const response = await getReleases(request, env);
        expect(response).toBeInstanceOf(Response);
        expect(response.status).toBe(200);
    });

    it('getLatestRelease', async () => {
        const request = new IncomingRequest('http://example.com');
        const release = await getLatestRelease(request, env);
        expect(release).toEqual(
            expect.objectContaining({
                tag_name: expect.any(String),
                assets: expect.any(Array),
                body: expect.any(String),
                published_at: expect.any(String)
            })
        );
    });

    it('findAssetSignature', async () => {
        const assets: Asset[] = [
            { name: 'test.sig', browser_download_url: 'http://example.com' },
            { name: 'lol.sig', browser_download_url: 'http://example.com/lol' },
            {
                name: 'test.zip',
                browser_download_url: 'http://example.com/test'
            }
        ];
        const signature = await findAssetSignature('test', assets);
        expect(signature).toContain('Example Domain');
    });
});
