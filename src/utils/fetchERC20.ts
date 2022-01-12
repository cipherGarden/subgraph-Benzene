import {
	fetchAccount
} from './fetchAccount'

import {
    fetchGamePool
} from './fetchGamePool'

import {
	Address,
} from '@graphprotocol/graph-ts'

import {Account, ERC20Token} from "../../generated/schema"

import {
    Benzene,
} from "../../generated/Benzene/Benzene"

// import { 
//     GamePool
// } from "../../generated/GamePool/GamePool"

export function fetchERC20(address: Address): ERC20Token {
	let token = ERC20Token.load(address.toHex())

	if (token == null) {
		let contract              = Benzene.bind(address)
		let name                  = contract.try_name()
		let symbol                = contract.try_symbol()
		let decimals              = contract.try_decimals()
        let totalSupply           = contract.try_totalSupply()
        let gamePool              = fetchGamePool(contract.GamePoolAddress())
        let advisorPool           = contract.AdvisorPoolAddress()
        let teamPool              = contract.TeamPoolAddress()
		token                     = new ERC20Token(address.toHex())
		// Common
		token.name     = name.reverted     ? null : name.value
		token.symbol   = symbol.reverted   ? null : symbol.value
		token.decimals = decimals.reverted ? 18   : decimals.value
        // token.totalSupply = totalSupply
        token.advisorPool = advisorPool
        token.game = gamePool.id
        token.teamPool = teamPool
		token.save()

		// let account     = fetchAccount(address, address)
		// account.asERC20 = token.id
		// account.save()

        //creates dynamic data source instance from GamePool template
        //not trigerring. need to use upgrade contract template?
        // GamePool.create(gamePool)
	}

	return token as ERC20Token
}