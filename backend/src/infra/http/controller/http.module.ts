import { DatabaseModule } from '@/infra/database/prisma/database.module'
import { Module } from '@nestjs/common'
import { AuthenticateUserController } from './user/authenticate-user.controller'
import { AuthenticateUserService } from '@/domain/user/application/services/authenticate-user.service'
import { CryptographyModule } from '@/infra/cryptography/cryptography.module'
import { CreateUserService } from '@/domain/user/application/services/create-user.service'
import { GetUserProfileService } from '@/domain/user/application/services/get-user-profile.service'
import { ListUsersService } from '@/domain/user/application/services/list-users.service'
import { UpdateUserProfileService } from '@/domain/user/application/services/update-user-profile.service'
import { UpdateUserService } from '@/domain/user/application/services/update-user.service'
import { ListUsersController } from './user/list-users.controller'
import { CreateUserController } from './user/create-user.controller'
import { UpdateUserProfileController } from './user/update-user-profile.controller'
import { UpdateUserController } from './user/update-user.controller'
import { GetUserProfileController } from './user/get-user-profile.controller'
import { InactivateUserController } from './user/inactivate-user.controller'
import { InactivateUserService } from '@/domain/user/application/services/inactivate-user.service'
import { EmailModule } from '@/infra/email/mailer.module'
import { CreateEquipmentController } from './equipment/create-equipment.controller'
import { ListEquipmentsController } from './equipment/list-equipments.controller'
import { UpdateEquipmentController } from './equipment/update-equipment.controller'
import { MarkEquipmentAsMaintenanceController } from './equipment/mark-equipment-as-maintenance.controller'
import { MarkEquipmentAsAvailableController } from './equipment/mark-equipment-as-available.controller'
import { InactivateEquipmentController } from './equipment/inactivate-equipment.controller'
import { CheckEquipmentAvailabilityController } from './equipment/check-equipment-availability.controller'
import { CreateEquipmentService } from '@/domain/equipment/application/services/create-equipment.service'
import { ListEquipmentsService } from '@/domain/equipment/application/services/list-equipments.service'
import { UpdateEquipmentService } from '@/domain/equipment/application/services/update-equipment.service'
import { MarkEquipmentAsMaintenanceService } from '@/domain/equipment/application/services/mark-equipment-as-maintenance.service'
import { MarkEquipmentAsAvailableService } from '@/domain/equipment/application/services/mark-equipment-as-available.service'
import { InactivateEquipmentService } from '@/domain/equipment/application/services/inactivate-equipment.service'
import { CheckEquipmentAvailabilityService } from '@/domain/equipment/application/services/check-equipment-availability.service'
import { CreateSchedulingController } from './scheduling/create-scheduling.controller'
import { ListSchedulingsController } from './scheduling/list-schedulings.controller'
import { ConfirmSchedulingController } from './scheduling/confirm-scheduling.controller'
import { CancelSchedulingController } from './scheduling/cancel-scheduling.controller'
import { UpdateSchedulingController } from './scheduling/update-scheduling.controller'
import { CreateSchedulingService } from '@/domain/scheduling/application/services/create-scheduling.service'
import { ListSchedulingsService } from '@/domain/scheduling/application/services/list-schedulings.service'
import { ConfirmSchedulingService } from '@/domain/scheduling/application/services/confirm-scheduling.service'
import { CancelSchedulingService } from '@/domain/scheduling/application/services/cancel-scheduling.service'
import { UpdateSchedulingService } from '@/domain/scheduling/application/services/update-scheduling.service'
import { AutoCompleteSchedulingsService } from '@/domain/scheduling/application/services/auto-complete-schedulings.service'
import { GetDashboardStatsController } from './dashboard/get-dashboard-stats.controller'
import { GetDashboardStatsService } from '@/domain/dashboard/application/services/get-dashboard-stats.service'
import { ScheduleModule } from '@nestjs/schedule'

@Module({
  imports: [DatabaseModule, CryptographyModule, EmailModule, ScheduleModule.forRoot()],
  controllers: [
    AuthenticateUserController,
    CreateUserController,
    GetUserProfileController,
    ListUsersController,
    UpdateUserProfileController,
    UpdateUserController,
    InactivateUserController,
    CreateEquipmentController,
    ListEquipmentsController,
    UpdateEquipmentController,
    MarkEquipmentAsMaintenanceController,
    MarkEquipmentAsAvailableController,
    InactivateEquipmentController,
    CheckEquipmentAvailabilityController,
    CreateSchedulingController,
    ListSchedulingsController,
    ConfirmSchedulingController,
    CancelSchedulingController,
    UpdateSchedulingController,
    GetDashboardStatsController,
  ],
  providers: [
    AuthenticateUserService,
    CreateUserService,
    GetUserProfileService,
    ListUsersService,
    UpdateUserProfileService,
    UpdateUserService,
    InactivateUserService,
    CreateEquipmentService,
    ListEquipmentsService,
    UpdateEquipmentService,
    MarkEquipmentAsMaintenanceService,
    MarkEquipmentAsAvailableService,
    InactivateEquipmentService,
    CheckEquipmentAvailabilityService,
    CreateSchedulingService,
    ListSchedulingsService,
    ConfirmSchedulingService,
    CancelSchedulingService,
    UpdateSchedulingService,
    AutoCompleteSchedulingsService,
    GetDashboardStatsService,
  ],
})
export class HttpModule {}
