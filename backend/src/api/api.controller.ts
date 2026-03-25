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

  @Get('double/history')
  async getDoubleHistory() {
    // Return last 20 rounds for the UI dots (Blaze style)
    const history = await this.prisma.doubleRoundResult.findMany({
      orderBy: { timestamp: 'desc' },
      take: 20,
    });
    return history.reverse(); // oldest to newest
  }

  @Get('double/active-bets')
  async getDoubleActiveBets(@Query('roundId') roundId: string) {
    if (!roundId) return [];
    
    // Return bets for the current round to populate the feed instantly on load
    const bets = await this.prisma.doubleBet.findMany({
      where: { roundId: Number(roundId) },
      orderBy: { timestamp: 'desc' },
    });
    return bets;
  }

  @Get('double/player-stats')
  async getDoublePlayerStats(@Query('address') address?: string) {
    if (!address) return { totalGames: 0, totalPaidOut: 0, winRate: 0 };

    // Query all bets placed by this single player accounting for Checksum and Lowercase variants
    const bets = await this.prisma.doubleBet.findMany({
        where: { 
            OR: [
                { player: address },
                { player: address.toLowerCase() }
            ]
        }
    });
    
    if (bets.length === 0) return { totalGames: 0, totalPaidOut: 0, winRate: 0 };

    // Fetch the resolved results for the rounds they played
    const roundIds = [...new Set(bets.map(b => b.roundId))];
    const results = await this.prisma.doubleRoundResult.findMany({
        where: { roundId: { in: roundIds } }
    });

    const resultMap = new Map(results.map(r => [r.roundId, r.color]));

    let totalPaidOut = 0;
    let wins = 0;

    bets.forEach(bet => {
        const resultColor = resultMap.get(bet.roundId);
        if (!resultColor) return; // Round hasn't finished rolling yet

        // 1=Red, 2=Black, 3=White
        if (bet.color === resultColor) {
            wins++;
            if (bet.color === 3) {
                totalPaidOut += bet.amount * 14;
            } else {
                totalPaidOut += bet.amount * 2;
            }
        }
    });

    return {
        totalGames: bets.length,
        totalPaidOut,
        winRate: Math.round((wins / bets.length) * 100)
    };
  }

  @Get('double/player-history')
  async getDoublePlayerHistory(@Query('address') address?: string) {
    if (!address) return [];

    // Fetch last 50 personal bets accounting for Checksum routing
    const bets = await this.prisma.doubleBet.findMany({
        where: { 
            OR: [
                { player: address },
                { player: address.toLowerCase() }
            ]
        },
        orderBy: { timestamp: 'desc' },
        take: 50
    });

    const roundIds = [...new Set(bets.map(b => b.roundId))];
    const results = await this.prisma.doubleRoundResult.findMany({
        where: { roundId: { in: roundIds } }
    });

    const resultMap = new Map(results.map(r => [r.roundId, r]));

    // Construct robust history objects for the UI
    return bets.map(bet => {
        const result = resultMap.get(bet.roundId);
        let status = 'PENDING';
        let payout = 0;
        
        if (result) {
            if (bet.color === result.color) {
                status = 'WON';
                payout = bet.color === 3 ? bet.amount * 14 : bet.amount * 2;
            } else {
                status = 'LOST';
            }
        }

        return {
            roundId: bet.roundId,
            betAmount: bet.amount,
            betColor: bet.color,
            resultColor: result?.color,
            timestamp: bet.timestamp,
            status,
            payout
        };
    });
  }
}
