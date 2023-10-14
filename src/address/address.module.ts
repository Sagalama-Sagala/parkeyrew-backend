import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AddressSchema } from './schemas/address.schema'
import { AddressController } from './address.controller';
import { AddressService } from './address.service';
import { UserModule } from 'src/user/user.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'Address', schema: AddressSchema }]),
        forwardRef(() => UserModule),
    ],
    controllers: [AddressController],
    providers: [AddressService],
    exports: [AddressService]
})
export class AddressModule {}
