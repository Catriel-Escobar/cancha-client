import { Injectable } from '@angular/core';
import { BaseHttpService } from '../../shared/data-access/base-http.service';

@Injectable({
  providedIn: 'root',
})
export class AuthServiceService extends BaseHttpService {}
