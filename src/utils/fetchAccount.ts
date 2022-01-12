import { Address } from '@graphprotocol/graph-ts';
import {Account} from "../../generated/schema"
import { fetchERC20 } from './fetchERC20';
// what is the return value on this?
export function fetchAccount(address: Address, BZNContract: Address): Account {
    let token = fetchERC20(BZNContract)
    let account = Account.load(address.toHex())
    //let account = new Account(address.toHex())
    if(!account) {
        //create acount here
            //may need to import more helpers to acccess event data
        account = new Account(address.toHex())
        account.ERC20Token = token.id

    }
    account.save()
    return account
}