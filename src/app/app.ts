import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { Header } from './header/header';
import { Footer } from './footer/footer';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastModule, Header, Footer],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
