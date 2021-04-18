import { Injectable } from '@angular/core';
import {Action, Selector, State, StateContext, Store} from '@ngxs/store';

import {Subscription} from 'rxjs';
import {ListenForStocks, LoadStockFromStorage, StocksLoggedIn, StopListeningForStocks, UpdateStocks} from './stock.actions';
import {StockValue} from '../../stock/shared/stock.model';
import {StockService} from '../../stock/shared/stock.service';


export interface StockStateModel {
  Stocks: StockValue[];
  RelevantStock: StockValue | undefined;
}

@State<StockStateModel>({
  name: 'stock',
  defaults: {
    Stocks: [],
    RelevantStock: undefined,
  }
})
@Injectable()
export class StockState {
  private stocksUnsub: Subscription | undefined;

  constructor(private stockService: StockService) {
  }

  @Selector()
  static relevantStock(state: StockStateModel): StockValue |undefined {
    return state.RelevantStock;
  }

  @Selector()
  static stocks(state: StockStateModel): StockValue[] {
    return state.Stocks;
  }

  @Selector()
  static stockIds(state: StockStateModel): string[] {
    return state.Stocks.map(c => c.id);
  }



  @Action(ListenForStocks)
  getStocks(ctx: StateContext<StockStateModel>): void {

    this.stocksUnsub = this.stockService.listenForStocks()
      .subscribe(stocks => {
        ctx.dispatch(new UpdateStocks(stocks));
      });
  }

  @Action(StopListeningForStocks)
  stopListeningForStocks(ctx: StateContext<StockStateModel>): void {
    if (this.stocksUnsub) {
      this.stocksUnsub.unsubscribe();
    }
  }

  @Action(UpdateStocks)
  updateStocks(ctx: StateContext<StockStateModel>, uc: UpdateStocks): void {

    const state = ctx.getState();
    const newState: StockStateModel = {
      ...state,
      Stocks: uc.stocks
    };
    ctx.setState(newState);
  }

  @Action(StocksLoggedIn)
  stockClientLoggedIn(ctx: StateContext<StockStateModel>, stockLoggedInAction: StocksLoggedIn): void {
    const state = ctx.getState();
    const newState: StockStateModel = {
      ...state,
      RelevantStock: stockLoggedInAction.stock
    };
    ctx.setState(newState);
  }

  @Action(LoadStockFromStorage)
  loadStockFromStorage(ctx: StateContext<StockStateModel>): void {
    const state = ctx.getState();
    const stock = state.RelevantStock;
    if (stock) {
      this.stockService.joinStock({
        id: stock.id,
        stockName: stock.stockName,
        currValue: stock.currentValue,
        initValue: stock.initValue,
        description: stock.description
      });
    }
  }
}
