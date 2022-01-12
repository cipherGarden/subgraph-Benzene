import { ethereum, BigInt} from "@graphprotocol/graph-ts"
import {
	constants,
	decimals,
	events,
	transactions,
} from '@amxx/graphprotocol-utils'
import {
  Benzene,
  Mint,
  Burn,
  Approval,
  Transfer,
  ConstructorCall__Outputs,
} from "../../generated/Benzene/Benzene"

import {
    Redeem
} from "../../generated/GamePool/GamePool"

import { GamePool, ERC20Redeem } from "../../generated/schema"
import { toBigDecimal } from "../utils/toBigDecimal"
import { fetchAccount } from "../utils/fetchAccount"
import { fetchERC20 } from "../utils/fetchERC20"
// import { TokenMint, TokenBurn, ERC20Transfer, ERC20Approval} from "../../generated/schema"

export function handleRedeem(event: Redeem): void {
    let game = GamePool.load(event.address.toHex())
    let redeem = ERC20Redeem.load(event.params._tokenId.toString())
    // let token = fetchERC20()
    if (!game) {
      game= new GamePool(event.address.toHex())
    }
    
    if (!redeem) {
        redeem = new ERC20Redeem(event.params._tokenId.toString())
    }
    //we are passing the gamepool address as second param here. We Want The BZN contract Adress Instead!!!
    //let account = fetchAccount(event.params.user, event.address)
    let account = event.params.user
    // redeem.account = account.id
    redeem.account = account.toHex()
    redeem.game = game.id
    redeem.vehicle = event.params._tokenId
    redeem.value = toBigDecimal(event.params.amount, 18)
    redeem.valueExact = event.params.amount

    game.save()
    redeem.save()
  }
  