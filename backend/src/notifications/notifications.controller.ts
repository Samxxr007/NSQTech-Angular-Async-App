import { Controller, Get, Patch, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { DatabaseService } from '../database/database.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { Notification } from '../models/notification.model';

@ApiTags('Notifications')
@ApiBearerAuth()
@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly databaseService: DatabaseService) {}

  @Get()
  @ApiOperation({ summary: 'Get notifications for current user' })
  @ApiResponse({ status: 200, description: 'List of notifications' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 20 })
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNum = parseInt(page || '1', 10);
    const limitNum = parseInt(limit || '20', 10);
    
    const allNotifications: Notification[] = this.databaseService.getNotifications().value();
    
    // Sort by createdAt descending
    const sorted = [...allNotifications].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
    
    const total = sorted.length;
    const startIndex = (pageNum - 1) * limitNum;
    const data = sorted.slice(startIndex, startIndex + limitNum);
    const unreadCount = allNotifications.filter(n => !n.isRead).length;

    return {
      data,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
      unreadCount,
    };
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Mark notification as read' })
  @ApiResponse({ status: 200, description: 'Notification marked as read' })
  markAsRead(@Param('id') id: string) {
    const notification = this.databaseService.getNotifications().find({ id }).value();
    if (notification) {
      this.databaseService.getNotifications().find({ id }).assign({ isRead: true }).write();
    }
    return { success: true };
  }

  @Patch('mark-all-read')
  @ApiOperation({ summary: 'Mark all notifications as read' })
  markAllRead() {
    const notifications = this.databaseService.getNotifications().value();
    notifications.forEach((n: Notification) => {
      if (!n.isRead) {
        this.databaseService.getNotifications().find({ id: n.id }).assign({ isRead: true }).write();
      }
    });
    return { success: true };
  }
}
