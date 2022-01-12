import { Address } from '@graphprotocol/graph-ts';
import { GamePool } from "../../generated/schema"

export function fetchGamePool(address: Address): GamePool {
    let _gamepool = GamePool.load(address.toHex())
    if(!_gamepool) {
        _gamepool = new GamePool(address.toHex())
    }
    
    _gamepool.save()
    return _gamepool
}