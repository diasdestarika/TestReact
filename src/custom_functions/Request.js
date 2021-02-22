
  function Get(url,responseSuccess,responseFail,connectionFail){

        fetch(url, {
              method: 'GET'
          })
            .then(response => {

                if (response.ok) {

                      response.json().then( data => responseSuccess(data));

                  }
                  else{responseFail(response)}

            },e => connectionFail(e));


  }

  function Post(url,body,responseSuccess,responseFail,connectionFail){

      fetch(url, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
              'Content-Type': 'application/json'
            }
      })
        .then(response => {

            if (response.ok) {

                response.json().then( data => responseSuccess(data));

            }
            else{responseFail(response)}

        },e => connectionFail(e));


  }

  function Put(url,body,responseSuccess,responseFail,connectionFail){

      fetch(url, {
            method: 'PUT',
            body: JSON.stringify(body),
            headers: {
              'Content-Type': 'application/json'
            }
        })
          .then(response => {

              if (response.ok) {

                  response.json().then( data => responseSuccess(data));

              }
              else{responseFail(response)}

          },e => connectionFail(e));


  }

  function Patch(url,body,responseSuccess,responseFail,connectionFail){

      fetch(url, {
            method: 'PATCH',
            body: JSON.stringify(body),
            headers: {
              'Content-Type': 'application/json'
            }
        })
          .then(response => {

              if (response.ok) {

                  response.json().then( data => responseSuccess(data));

              }
              else{responseFail(response)}

          },e => connectionFail(e));


  }

  function Delete(url,body,responseSuccess,responseFail,connectionFail){

    fetch(url, {
          method: 'DELETE',
          body: JSON.stringify(body),
          headers: {
            'Content-Type': 'application/json'
          }
      })
        .then(response => {

          if (response.ok) {

            response.json().then( data => responseSuccess(data));

          }
          else{responseFail(response)}

        },e => connectionFail(e));

  }

  export {Get,Post,Put,Patch,Delete}