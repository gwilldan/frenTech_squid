import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_} from "typeorm"
import * as marshal from "./marshal"

@Entity_()
export class Trade {
    constructor(props?: Partial<Trade>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Column_("bytea", {nullable: false})
    trader!: Uint8Array

    @Column_("bytea", {nullable: false})
    subject!: Uint8Array

    @Column_("bool", {nullable: false})
    isBuy!: boolean

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    shareAmount!: bigint

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    ethAmount!: bigint

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    protocolEthAmount!: bigint

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    subjectEthAmount!: bigint

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    supply!: bigint

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    blockNumber!: bigint

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    blockTimestamp!: bigint

    @Column_("bytea", {nullable: false})
    transactionHash!: Uint8Array
}
