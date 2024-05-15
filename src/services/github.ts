import { Env } from '../../worker-configuration';
import { Request, Response } from '@cloudflare/workers-types';

export type Asset = {
    name: string;
    browser_download_url: string;
};

type Release = {
    tag_name: string;
    assets: Asset[];
    body: string;
    published_at: string;
};

/**
 * Get the latest release from the GitHub API
 * @param request The Worker Request object from the fetch event
 * @param env The Worker environment object
 * @returns Response object from the GitHub API
 */
export async function getReleases(
    request: Request,
    env: Env
): Promise<Response> {
    // build the request headers conditionally
    const headers = new Headers({
        Accept: 'application/vnd.github.preview',
        'User-Agent': request.headers.get('User-Agent') as string
    });

    if (env.GITHUB_API_TOKEN?.length) {
        headers.set('Authorization', `token ${env.GITHUB_API_TOKEN}`);
    }

    // @ts-expect-error - Fetch does not have the webSocket property
    return await fetch(
        `https://api.github.com/repos/${env.GITHUB_ACCOUNT}/${env.GITHUB_REPO}/releases/latest`,
        {
            method: 'GET',
            headers
        }
    );
}

/**
 * Get the latest release from the GitHub API as a Release object
 * @param request The Worker Request object from the fetch event
 * @param env The Worker environment object
 * @returns The latest release as a Release object
 */
export async function getLatestRelease(
    request: Request,
    env: Env
): Promise<Release> {
    const releases: Response = await getReleases(request, env);
    return (await releases.json()) as Release;
}

/**
 * Find the signature file for a given asset
 * @param fileName The name of the file to find the signature for
 * @param assets The assets to search for the signature
 * @returns The signature as a string or undefined if not found
 */
export async function findAssetSignature(
    fileName: string,
    assets: Asset[]
): Promise<string | undefined> {
    // check in our assets if we have a file: `fileName.sig`
    // by example fileName can be: App-1.0.0.zip

    const foundSignature = assets.find(
        (asset) => asset.name.toLowerCase() === `${fileName.toLowerCase()}.sig`
    );

    if (!foundSignature) {
        return undefined;
    }

    const response = await fetch(foundSignature.browser_download_url);
    if (response.status !== 200) {
        return undefined;
    }

    return await response.text();
}
