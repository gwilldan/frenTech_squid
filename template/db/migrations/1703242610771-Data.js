module.exports = class Data1703242610771 {
    name = 'Data1703242610771'

    async up(db) {
        await db.query(`CREATE TABLE "ownership_transferred" ("id" character varying NOT NULL, "previous_owner" bytea NOT NULL, "new_owner" bytea NOT NULL, "block_number" numeric NOT NULL, "block_timestamp" numeric NOT NULL, "transaction_hash" bytea NOT NULL, CONSTRAINT "PK_f6d006434fd73398928f8110040" PRIMARY KEY ("id"))`)
        await db.query(`CREATE TABLE "trade" ("id" character varying NOT NULL, "trader" bytea NOT NULL, "subject" bytea NOT NULL, "is_buy" boolean NOT NULL, "share_amount" numeric NOT NULL, "eth_amount" numeric NOT NULL, "protocol_eth_amount" numeric NOT NULL, "subject_eth_amount" numeric NOT NULL, "supply" numeric NOT NULL, "block_number" numeric NOT NULL, "block_timestamp" numeric NOT NULL, "transaction_hash" bytea NOT NULL, CONSTRAINT "PK_d4097908741dc408f8274ebdc53" PRIMARY KEY ("id"))`)
    }

    async down(db) {
        await db.query(`DROP TABLE "ownership_transferred"`)
        await db.query(`DROP TABLE "trade"`)
    }
}
