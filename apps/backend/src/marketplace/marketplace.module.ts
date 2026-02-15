import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { CosmeticsModule } from '../cosmetics/cosmetics.module';
import { UsersModule } from '../users/users.module';
import { MarketplaceController } from './marketplace.controller';
import { MarketplaceService } from './marketplace.service';

@Module({
  imports: [PrismaModule, CosmeticsModule, UsersModule],
  controllers: [MarketplaceController],
  providers: [MarketplaceService],
  exports: [MarketplaceService],
})
export class MarketplaceModule {}
