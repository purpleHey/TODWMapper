# TODWMapper

## Getting Started

### Developer Setup

First, you need a development key for the [Canvas API](https://canvas.instructure.com/doc/api/index.html). Make a file called `app/routes/sessionToken.js` with the follwoing:
```javascript
exports.sessionKey = function () {
    return '<your-session-key>';
}
```

* `npm install`

### Running the Application

* `mongod` (in a different terminal)
* `npm start`
* visit `localhost:3000`
