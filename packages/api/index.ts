/// <reference lib="deno.ns" />

import dotenv from 'npm:dotenv'
import process from 'node:process'
import { Options, UnsplashPhoto, photosType } from '../@types.ts'
import { createApi } from 'npm:unsplash-js'
import type { ApiResponse } from 'npm:unsplash-js/dist/helpers/response'
import type { Random } from 'npm:unsplash-js/dist/methods/photos/types'
import * as log from 'jsr:@std/log'

/**
 * Determines the current environment and loads the appropriate .env file.
 */
const env = Deno.env.get('DENO_ENV') || 'development'

dotenv.config({
  path: env === 'development' ? '../../.env.local' : '../../.env.production',
})

/**
 * Sets up logging with a custom formatter and color support.
 */
log.setup({
  handlers: {
    default: new log.ConsoleHandler('DEBUG', {
      formatter: (record) =>
        `${record.datetime} [${record.levelName}] ${record.msg} ${JSON.stringify(record.args, null, 2)}`,
      useColors: true,
    }),
  },
})

/**
 * Unsplash API client instance.
 */
const unsplash = createApi({
  accessKey: process.env.UNSPLASH_ACCESS_KEY,
})

/**
 * Default headers for all API responses.
 */
const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Cache-Control',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Cache-Control': `public, max-age=${process.env.PUBLIC_CACHE_TTL}`,
}

/**
 * Type for API options extracted from the request.
 */
type APIOptions = Pick<Options, 'unsplash.photo.type' | 'unsplash.photo.value'>

/**
 * Starts the Deno HTTP server and handles errors globally.
 */
Deno.serve(
  {
    /**
     * Handles errors thrown during request processing.
     * @param err The error object
     * @returns A JSON response with error details
     */
    onError: function handleError(err) {
      log.error((err as Error).message, err as Error)

      return Response.json({
        message: (err as Error).message,
        status: 500,
      })
    },
  },
  handleRequests,
)

/**
 * Main request handler for the API.
 * Handles CORS preflight, validates input, and proxies to Unsplash.
 * @param req The incoming HTTP request
 * @returns A Response object
 */
async function handleRequests(req: Request) {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    log.info(`OPTIONS to ${req.url}`)

    return new Response('', {
      status: 200,
      headers,
    })
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    throw new Error(`Invalid HTTP method "${String(req.method)}"!`)
  }

  log.info(`GET ${req.url}`)

  // Parse query parameters from the request URL
  const url = new URL(req.url)
  const params = Object.fromEntries(url.searchParams) as
    | Partial<APIOptions>
    | undefined

  // Validate required parameters
  if (!params?.['unsplash.photo.type'] || !params?.['unsplash.photo.value']) {
    throw new Error(`Missing required parameters!`)
  }

  // Validate that the photo type is supported
  if (!photosType.includes(params['unsplash.photo.type'])) {
    throw new Error(`Invalid key parameter!`)
  }

  log.info(`${req.url} Calling Unsplash API`, params)

  // Fetch a photo from Unsplash based on the provided options
  const res = await fetchPhotoBasedOnOptions(params as APIOptions)

  // Ensure a response was received
  if (!res) {
    throw new Error(`Unable to retreive an API response!`)
  }

  // Handle Unsplash API errors
  if (res.type === 'error') {
    throw new Error(res.errors.join(' / '))
  }

  // Parse the photo and download location from the Unsplash response
  const { photo, downloadLocation } = parsePhoto(res.response)

  // Track the photo download with Unsplash
  await unsplash.photos.trackDownload({ downloadLocation })

  log.info(`${req.url} Tracked download`, downloadLocation)

  log.info(`${req.url} Returning photo`, photo)

  // Return the photo as a JSON response with appropriate headers
  return Response.json(photo, {
    headers,
  })
}

/**
 * Retrieves a single image from the Unsplash API based on
 * the user's options.
 * @param options Extension's options object
 * @returns A single image
 */
function fetchPhotoBasedOnOptions(options: APIOptions) {
  switch (options['unsplash.photo.type']) {
    case 'collection': {
      return unsplash.photos.getRandom({
        collectionIds: [options['unsplash.photo.value']],
      }) as Promise<ApiResponse<Random>>
    }

    case 'search': {
      return unsplash.photos.getRandom({
        query: options['unsplash.photo.value'],
      }) as Promise<ApiResponse<Random>>
    }

    case 'topic': {
      return unsplash.photos.getRandom({
        topicIds: [options['unsplash.photo.value']],
      }) as Promise<ApiResponse<Random>>
    }

    case 'user': {
      return unsplash.photos.getRandom({
        username: options['unsplash.photo.value'],
      }) as Promise<ApiResponse<Random>>
    }
  }
}

/**
 * Transforms an Unsplash API Image object into our Domain
 * Image object.
 * @param data An image object from the Unsplash API
 * @returns An object with two properties, the UnsplashPhoto
 * object and a link used to track photo downloads
 */
function parsePhoto(data: Random) {
  const photo: UnsplashPhoto = {
    author: {
      name: data.user.name,
      link: data.user.links.html,
    },
    color: data.color,
    url: data.urls.raw,
  }

  return { photo, downloadLocation: data.links.download_location }
}
