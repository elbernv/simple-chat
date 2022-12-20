import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient, PrismaPromise } from '@prisma/client';
import { PaginatedResult } from '@core/prisma/interfaces/pagination-result.interface';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    super({
      log: [
        {
          emit: 'event',
          level: 'query',
        },
      ],
    });
  }

  async onModuleInit() {
    await this.$connect();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // this.$on('query', async (e) => {
    //   eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //   @ts-ignore
    //   console.log(`${e.query} ${e.params}`);
    // });
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }

  public buildUrl(
    resourceId: number | bigint | string,
    resourceUrl: string,
  ): string {
    const configService = new ConfigService();
    const baseUrl: string = configService.get<string>('BASE_URL');

    return `${baseUrl}/${resourceUrl}/${resourceId}`;
  }

  public async paginatedSearch<T, K>(
    model: {
      count: (args: any) => PrismaPromise<number>;
      findMany: (args: any) => PrismaPromise<T[]>;
    },
    args: { where?: any; take?: number } & K,
    resourceUrl: string,
    page: number,
  ): Promise<PaginatedResult<T>> {
    const configService = new ConfigService();
    const limit = args?.take || 10;
    const skip = page > 0 ? limit * (page - 1) : 0;
    const [totalItems, data] = await Promise.all([
      model.count({ where: args.where }),
      model.findMany({
        ...args,
        take: limit,
        skip,
      }),
    ]);

    const baseUrl: string = `${configService.get<string>(
      'BASE_URL',
    )}${resourceUrl}?`;
    const lastPageNumber: number = Math.ceil(totalItems / limit);
    const nextPageNumber: number = page < lastPageNumber ? page + 1 : null;
    const previosPageNumber: number = page > 1 ? page - 1 : null;
    const lastPageUrl: string = `${baseUrl}limit=${limit}&page=${lastPageNumber}`;
    const nextPageUrl: string =
      (nextPageNumber && `${baseUrl}limit=${limit}&page=${nextPageNumber}`) ||
      null;
    const previousPageUrl: string =
      (previosPageNumber &&
        `${baseUrl}limit=${limit}&page=${previosPageNumber}`) ||
      null;
    const firstPageUrl: string = `${baseUrl}limit=${limit}&page=${1}`;

    return {
      data,
      meta: {
        totalItems,
        page,
        limit,
        previousPageUrl,
        nextPageUrl,
        firstPageUrl,
        lastPageUrl,
      },
    };
  }
}
