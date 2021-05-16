import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { PaginateModule } from '@app/components/paginate/paginate.module';
import { SortModule } from '@app/components/sort/sort.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UsersComponent } from './pages/users/users.component';

@NgModule({
  declarations: [AppComponent, UsersComponent],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule, PaginateModule, SortModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
