import { Controller, Get, Query } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Controller('api/v1')
export class ApiController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('wins')
  async getWins() {
    // Fetch directly from our fast local SQLite database! No RPC limits here!
    const history = await this.prisma.drawHistory.findMany({
      orderBy: { timestamp: 'desc' },
    });

    return history;
  }
  
  @Get('stats')
  async getStats(@Query('address') address?: string) {
    const history = await this.prisma.drawHistory.findMany({
      orderBy: { timestamp: 'desc' }
    });
    
    let totalPaidOut = 0;
    let totalGames = 0;

    if (address) {
        const addr = address.toLowerCase();
        history.forEach((draw: any) => {
            let wonInThisDraw = false;
            
            if (draw.winner1.toLowerCase() === addr) {
                totalPaidOut += draw.winner1Prize;
                wonInThisDraw = true;
            } else if (draw.winner2 && draw.winner2.toLowerCase() === addr) {
                totalPaidOut += draw.winner2Prize;
                wonInThisDraw = true;
            } else if (draw.winner3 && draw.winner3.toLowerCase() === addr) {
                totalPaidOut += draw.winner3Prize;
                wonInThisDraw = true;
            }

            if (wonInThisDraw) {
                totalGames++;
            }
        });

        return {
            totalGames,
            totalPaidOut,
        };
    }

    // Aggregate global stats dynamically
    history.forEach((draw: any) => {
        totalPaidOut += draw.winner1Prize;
        if (draw.winner2Prize) totalPaidOut += draw.winner2Prize;
        if (draw.winner3Prize) totalPaidOut += draw.winner3Prize;
    });
    
    return {
        totalGames: history.length,
        totalPaidOut,
    };
  }
}
