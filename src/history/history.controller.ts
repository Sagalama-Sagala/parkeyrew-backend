import { Controller, Param, Get, Put, Req } from "@nestjs/common";
import { ApiBadRequestResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { HistoryService } from "./history.service";

@ApiTags('History')
@Controller('history')
export class HistoryController {
    constructor(private readonly historyService: HistoryService){}

    @ApiOkResponse({
        description: 'get my salse successfully',
    })
    @Get('get-my-sale')
    async getMySalse(@Req() req: any): Promise<any>{
        return await this.historyService.findByShop(req.userId);
    }

    @ApiOkResponse({
        description: 'get my purchase successfully',
    })
    @Get('get-my-purchase')
    async getMyPurchase(@Req() req: any): Promise<any>{
        return await this.historyService.findByCustomer(req.userId);
    }
    
    @ApiOkResponse({
        description: 'update history status successfully',
    })
    @ApiBadRequestResponse({
        description: 'update history status failed',
    })
    @Put('update-to-ongoing/:id')
    async updateToOnGoing(@Param('id') id: string): Promise<any> {
        return await this.historyService.updateStatus(id,"ongoing");
    }

    @ApiOkResponse({
        description: 'update history status successfully',
    })
    @ApiBadRequestResponse({
        description: 'update history status failed',
    })
    @Put('update-to-complete/:id')
    async updateToComplete(@Param('id') id: string): Promise<any> {
        return await this.historyService.updateStatus(id,"complete");
    }
}