import { Subject } from "rxjs";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { environment } from "../../environments/environment";

// http://20.193.134.41:3013/

const BACKEND_URL = "http://20.193.134.41:3013/error";


@Injectable({ providedIn: "root" })
export class ErrorService {
  private errorListener = new Subject<string>();
   loggeduserId=null;
  constructor(private http: HttpClient) {}


  getErrorListener() {
    return this.errorListener.asObservable();
  }

  throwError(message: string) {
    this.errorListener.next(message);
  }

  handleError() {
    this.errorListener.next(null);
  }
 
getLoggedUser(loggeduserId){
console.log(loggeduserId);
this.loggeduserId=loggeduserId;
}
     
  postError(userName,errorMessage,errorStatusCode){
    console.log(userName);
    console.log(errorMessage);
    console.log(errorStatusCode);
    if(this.loggeduserId==null){
      let postError={userName:'null',errormessage:errorMessage,errorstatuscode:errorStatusCode}
      console.log(postError);
      return this.http
      .post<{ message: string }>(
        BACKEND_URL,
        postError
      ).subscribe(responseData=>{
        console.log(responseData);
        
      },error=>{
       console.log(error);
       
      })
    }else{
        let postError={userName:this.loggeduserId,errormessage:errorMessage,errorstatuscode:errorStatusCode}
        return this.http
        .post<{ message: string }>(
          BACKEND_URL,
          postError
        ).subscribe(responseData=>{
          console.log(responseData);
          
        })
    }
  

}

}
