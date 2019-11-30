import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Estado } from './Estado';
import { environment } from '@environments/environment';


@Injectable({ providedIn: 'root' })


export class InicioService {
    constructor(private http: HttpClient) { }

    obtenerListadoPoblacion(anio) {
        let data2017 = 'assets/data/2017.json';
        return this.http.get<any>(data2017);
    }
}