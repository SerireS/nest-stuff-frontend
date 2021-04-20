import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl} from '@angular/forms';
import {Observable, Subject, Subscription} from 'rxjs';
import {debounceTime, map, take, takeUntil} from 'rxjs/operators';
import {StockService} from './shared/stock.service';
import {StockValue} from './shared/stock.model';
import {StockState} from '../chat/state/stock.state';
import {Select, Store} from '@ngxs/store';
import {ListenForStocks} from '../chat/state/stock.actions';

@Component({
  selector: 'app-chat',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.scss']
})
export class StockComponent implements OnInit, OnDestroy {
  @Select(StockState.stocks) stockClients$: Observable<StockValue[]> | undefined;

  stockFC = this.fb.group({
    id: [''],
    stockName: [''],
    initValue: [''],
    currentValue: [''],
    description: ['']
  });

  valueFC = this.fb.group({
    newValue: [''],
  });
  stocks$: Observable<StockValue[]> | undefined;
  unsubscribe$ = new Subject();
  stockCreate: StockValue | undefined;
  error: string | undefined;
  selectedStock: StockValue | undefined;
  constructor(private stockService: StockService, private fb: FormBuilder, private store: Store) { }

  ngOnInit(): void {
    this.store.dispatch(new ListenForStocks());
    this.stocks$ = this.stockService.listenForStocks();
    this.stockService.welcomeStocks();
  }

  sendMessage(): void {
    console.log(this.stockFC.value);
  }

  ngOnDestroy(): void {
    console.log('Destroyed');
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  sendStock(): void {
    if (this.stockFC.value)
    {
      this.stockService.sendStock(this.stockFC.value);
      console.log(this.stockFC.value);
    }
  }

  onSelect(stock: StockValue): void {
    this.selectedStock = stock;
  }

  updateStock(): void {
    if (this.selectedStock)
    {
      this.stockService.updateStock(this.selectedStock.id, {
        id: this.selectedStock.id,
        currentValue: this.valueFC.value.newValue,
        description: this.selectedStock.description,
        initValue: this.selectedStock.initValue,
        stockName: this.selectedStock.stockName
      });
    }
  }
}
