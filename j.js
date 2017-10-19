const fetch = require('node-fetch')

const stubbedFetch = async () => ({
  status: 200,
  json: async () => ({
    id:  6300,
    login: 'ehrenmurdick',
    url: "http://github.com/users/ehrenmurdick"
  })
})

const url = "https://api.github.com/users/"
const prop = (a, s) => a[s]
const getter = s => a => a[s]()

const getJson = getter('json')

const liftM = f => async (...as) => {
  let vs = await Promise.all(as);
  return f(...vs);
}

const compose = (...fns) => {
  const step = f => g => x => f(g(x))
  return fns.reduce((a, b) => step(a)(b))
}

const consUrl = user => url + user

const join = (s, ...as) => as.join(s);

const getProp    = liftM(prop);

const dotProxy = {
  get: (target, name) => {
    return getProp(target, name);
  }
}
const liftGetters = (a) => new Proxy(a, dotProxy);

const checkResposneCode = async (respP) => {
  let resp = await respP;
  if (resp.status != 200) {
    let json = await resp.json();
    throw("Error: " + json.message);
    return json;
  }
  return resp;
}

const getGithubUser = compose(
  liftGetters,
  liftM(getter('json')),
  checkResposneCode,
  stubbedFetch,
  consUrl
);

const consoleLog = liftM(console.log);
const join_      = liftM(join);

let user       = getGithubUser('ehrenmurdick');
let userString = join_(' - ',
  user.login,
  user.id,
  user.url
);
consoleLog(userString);

consoleLog('last line');
