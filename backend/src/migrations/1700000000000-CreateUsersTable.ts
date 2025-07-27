import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateUsersTable1700000000000 implements MigrationInterface {
    name = 'CreateUsersTable1700000000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "users",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                        default: "gen_random_uuid()",
                    },
                    {
                        name: "firebase_uid",
                        type: "varchar",
                        isUnique: true,
                        isNullable: false,
                    },
                    {
                        name: "email",
                        type: "varchar",
                        isNullable: false,
                    },
                    {
                        name: "adventure_style",
                        type: "varchar",
                        isNullable: true,
                    },
                    {
                        name: "tourist_vibe",
                        type: "varchar",
                        isNullable: true,
                    },
                    {
                        name: "landscape_preferences",
                        type: "text",
                        isArray: true,
                        isNullable: true,
                    },
                    {
                        name: "pace_of_day",
                        type: "varchar",
                        isNullable: true,
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "now()",
                    },
                    {
                        name: "updated_at",
                        type: "timestamp",
                        default: "now()",
                    },
                ],
            }),
            true
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("users");
    }
} 