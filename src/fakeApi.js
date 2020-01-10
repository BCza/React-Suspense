export function fetchData() {
  let countPromise = fetchCount();
  let itemsPromise = fetchItems(countPromise);

  return {
    count: wrapPromise(countPromise),
    items: wrapPromise(itemsPromise)
  };
}

// Suspense integrations like Relay implement
// a contract like this to integrate with React.
// Real implementations can be significantly more complex.
// Don't copy-paste this into your project!
function wrapPromise(promise) {
  let status = "pending";
  let result;
  let suspender = promise.then(
    r => {
      status = "success";
      result = r;
    },
    e => {
      status = "error";
      result = e;
    }
  );
  return {
    read() {
      if (status === "pending") {
        throw suspender;
      } else if (status === "error") {
        throw result;
      } else if (status === "success") {
        return result;
      }
    }
  };
}

function fetchCount() {
  console.log("fetching count ...");
  return new Promise(resolve => {
    setTimeout(() => {
      console.log("fetched count");
      resolve(10000);
    }, 1000);
  });
}

// Here we have a set of requests that depend
// on data from initial request
// which is kinda messy but realistic
function fetchItems(countPromise) {
  console.log("fetching items ...");
  return new Promise(resolve => {
    countPromise.then(count => {
      resolve(
        new Array(count).fill(null).map((_, i) => {
          // create a promise for each individual item request
          return wrapPromise(fetchItem(i));
        })
      );
    });
  });
}

function fetchItem(index) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        x: Math.random(),
        y: Math.random()
      });
    }, Math.random() * 1000);
  });
}
