const todos = [
    { id: '1', title: 'First Todo' },
    { id: '2', title: 'Second Todo' },
    { id: '3', title: 'Third Todo' },
    { id: '4', title: 'Fourth Todo' },
    { id: '5', title: 'Fifth Todo' },
    { id: '6', title: 'Sixth Todo' },
];

// // Data Source, could be replaced with a real database
// const todos = [
//     {
//       title: "Todo 1",
//       desc: "This is my first Todo",
//       completed: true,
//     },
  
//     {
//       title: "Todo 2",
//       desc: "This is my second Todo",
//       completed: true,
//     },
  
//     {
//       title: "Todo 3",
//       desc: "This is my third Todo",
//       completed: true,
//     },
  
//     {
//       title: "Todo 4",
//       desc: "This is my fourth Todo",
//       completed: true,
//     },
  
//     {
//       title: "Todo 5",
//       desc: "This is my fifth Todo",
//       completed: true,
//     },
//   ];

const router = async function(req, res) {

    // GET: /api/todos
    if (req.url === "/api/todos" && req.method === "GET") {
        // set the status code and content-type
        res.writeHead(200, {"Content-Type": "application/json"});
        // get all todos and send data
        res.end(JSON.stringify(todos));
    }

    // POST: /api/todos
    if (req.url === "/api/todos" && req.method === "POST") {
        try {
            let body = "";
            // Listen for data event
            req.on("data", (chunk) => {
                body += chunk.toString();
            });
            // Listen for the end event
            req.on("end", async () => {
                // Create a new todo
                const newTodo = JSON.parse(body);
                todos.push(newTodo);
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify(newTodo));
            });
        } catch (error) {
            console.log(error);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Internal Server Error" }));
        }
    }

    // PUT: /api/todos/:id
    if (req.url.match(/\/api\/todos\/([0-9]+)/) && req.method === "PUT") {
        try {
            // extract id from url
            const id = req.url.split("/")[3];
            let body = "";

            req.on("data", (chunk) => {
                body += chunk.toString();
            });

            req.on("end", async () => {
                // Find and update document
                const todoIndex = todos.findIndex((todo) => todo.id === id);

                if (todoIndex === -1) throw new Error("Todo Does Not Exist");

                const updatedTodo = JSON.parse(body);
                todos[todoIndex] = { ...todos[todoIndex], ...updatedTodo };

                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify(todos[todoIndex]));
            });
        } catch (error) {
            console.log(error);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Internal Server Error" }));
        }
    }

    // DELETE: /api/todos/:id
    if (req.url.match(/\/api\/todos\/([0-9]+)/) && req.method === "DELETE") {
        try {
            const id = req.url.split("/")[3];
            
            // Find the index of the todo to delete
            const todoIndex = todos.findIndex((todo) => todo.id === id);
            if (todoIndex === -1) throw new Error("Todo does not exist");
                    
            todos.splice(todoIndex, 1);

            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Todo Deleted Successfully" }));

        } catch (error) {
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: error.message }));
        }
    }
};

module.exports = router;
