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
} from "../../generated/Benzene/Benzene"
import { toBigDecimal } from "../utils/toBigDecimal"
import { fetchAccount } from "../utils/fetchAccount"
import { fetchERC20 } from "../utils/fetchERC20"
import { TokenMint, TokenBurn, ERC20Transfer, ERC20Approval} from "../../generated/schema"



export function handleTransfer(event: Transfer): void {
  // entities handled: account, erc20, transfer, balance
  let token = fetchERC20(event.address)
  let from = fetchAccount(event.params.from, event.address)
  let to = fetchAccount(event.params.to, event.address)
  let transfer = new ERC20Transfer(events.id(event))
  // let token = ERC20Token.load(event.address.toHex())
  // transfer.transaction = transactions.log(event).id
	transfer.timestamp   = event.block.timestamp
	transfer.token       = token.id
	transfer.from        = from.id
	transfer.to          = to.id


  transfer.amount = event.params.value

  // if (!token) {
  //   let contract = Benzene.bind(event.address)
  //   token = new ERC20Token(event.address.toHex())

  //   let symbol = contract.symbol()
  //   let name = contract.name()
  //   let decimals = contract.decimals()
  //   let totalSupply = contract.totalSupply()
  //   let gamePool = contract.GamePoolAddress()
  //   let advisorPool = contract.AdvisorPoolAddress()
  //   let teamPool = contract.TeamPoolAddress()

  //   token.gamePool = gamePool
  //   token.advisorPool = advisorPool
  //   token.teamPool = teamPool
  //   token.symbol = symbol
  //   token.name = name
  //   token.decimals = decimals
  //   token.totalSupply = totalSupply
  //   token.save()
  // }
  transfer.save()
}







export function handleMint(event: Mint): void {
  // Entities can be loaded from the store using a string ID; this ID
  // needs to be unique across all entities of the same type
  let mint = TokenMint.load(event.transaction.hash.toHex())
  // Entities only exist after they have been saved to the store;
  // `null` checks allow to create entities on demand
  if (!mint) {
    mint = new TokenMint(event.transaction.hash.toHex())
    let receiver = fetchAccount(event.params.to, event.address)
    let token = fetchERC20(event.address)
    mint.token = token.id
    mint.timestamp = event.block.timestamp
    mint.to = receiver.id
    mint.valueExact = event.params.amount
    mint.value = toBigDecimal(event.params.amount, 18)
  }

 
  mint.save()

  // Note: If a handler doesn't require existing field values, it is faster
  // _not_ to load the entity from the store. Instead, create it fresh with
  // `new Entity(...)`, set the fields that should be updated and save the
  // entity back to the store. Fields that were not set or unset remain
  // unchanged, allowing for partial updates to be applied.

  // It is also possible to access smart contracts from mappings. For
  // example, the contract that has emitted the event can be connected to
  // with:
  //
  // let contract = Contract.bind(event.address)
  //
  // The following functions can then be called on this contract to access
  // state variables and other data:
  //
  // - contract.name(...)
  // - contract.approve(...)
  // - contract.totalSupply(...)
  // - contract.transferFrom(...)
  // - contract.decimals(...)
  // - contract.AdvisorPoolAddress(...)
  // - contract.decreaseApproval(...)
  // - contract.balanceOf(...)
  // - contract.symbol(...)
  // - contract.transfer(...)
  // - contract.increaseApproval(...)
  // - contract.GamePoolAddress(...)
  // - contract.allowance(...)
  // - contract.TeamPoolAddress(...)
}

export function handleBurn(event: Burn): void {
  let burn = TokenBurn.load(event.transaction.from.toHex())

  if (!burn) {
    let token = fetchERC20(event.address)
    let burner = fetchAccount(event.params.burner, event.address)
    burn = new TokenBurn(event.transaction.from.toHex())
    burn.token = token.id
    burn.burner = burner.id
    burn.timestamp = event.block.timestamp
    burn.valueExact = event.params.value
    burn.value = toBigDecimal(event.params.value, 18)
  }

  burn.save()
}






// export function handleTransfer(event: TransferEvent): void {
// 	let token = fetchERC20(event.address)
// 	let from  = fetchAccount(event.params.from)
// 	let to    = fetchAccount(event.params.to)

// 	let ev         = new ERC20Transfer(events.id(event))
// 	ev.transaction = transactions.log(event).id
// 	ev.timestamp   = event.block.timestamp
// 	ev.token       = token.id
// 	ev.from        = from.id
// 	ev.to          = to.id
// 	ev.value       = decimals.toDecimals(event.params.value, token.decimals)
// 	ev.valueExact  = event.params.value

// 	if (from.id != constants.ADDRESS_ZERO) {
// 		let balance        = fetchERC20Balance(token, from)
// 		let value          = new decimals.Value(balance.value)
// 		value.decrement(event.params.value)
// 		balance.valueExact = value.exact
// 		balance.save()

// 		ev.fromBalance = balance.id;
// 	}

// 	if (to.id != constants.ADDRESS_ZERO) {
// 		let balance = fetchERC20Balance(token, to)
// 		let value = new decimals.Value(balance.value)
// 		value.increment(event.params.value)
// 		balance.valueExact = value.exact
// 		balance.save()

// 		ev.toBalance = balance.id;
// 	}
// 	ev.save()
// }

export function handleApproval(event: Approval): void {
  // let type = event.params._event.logType
  let tx = event.transaction.hash.toHex();
  let ownerID = event.params.owner.toHex()
  let spenderID = event.params.spender.toHex()
  let id = tx.concat('/').concat(ownerID).concat('/').concat(spenderID)

	let approval = ERC20Approval.load(id)

  if(!approval) {
    let valueExact = event.params.value
    let value = toBigDecimal(event.params.value, 18)
    let owner = fetchAccount(event.params.owner, event.address)
    let spender = fetchAccount(event.params.spender, event.address)
    let token = fetchERC20(event.address)
    approval = new ERC20Approval(id)
    approval.token = token.id
    approval.owner = owner.id
    approval.spender = spender.id
    approval.valueExact = valueExact
    approval.value = value
  }
  
  // let token = ERC20Token.load(event.address)
	// if (token == null) return
	// let approval        = fetchERC20Approval(token, owner, spender)

	approval.save()

}