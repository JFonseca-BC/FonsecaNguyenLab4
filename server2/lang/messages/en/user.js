// ./lang/messages/en/user.js

class UserMessages {
    constructor() {
        this.title = "Lab 4";
        this.header = "Patient Database Interface";
        this.insertButton = "Insert Default Patients";
        this.queryTitle = "Run SQL Query";
        this.queryPlaceholder = "ENTER SQL SELECT QUERY HERE...";
        this.submitQueryButton = "Submit Query";
        this.responseTitle = "Server Response";
        this.errorMessage = "Error connecting to server.";
        this.dbError = "Database operation failed.";
    }
}

module.exports = UserMessages;