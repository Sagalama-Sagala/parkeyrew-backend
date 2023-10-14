import { Controller, Param, Put } from "@nestjs/common";
import { ApiBadRequestResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { HistoryService } from "./history.service";

@ApiTags('History')
@Controller('history')
export class HistoryController {
    constructor(private readonly historyService: HistoryService){}

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