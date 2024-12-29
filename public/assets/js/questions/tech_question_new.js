const allQuestions = [
    {
      question: "What is the inheritance?",
      correct_answer: "Child class deriving properties from parent class"
    },
    {
      question: "what is encapsulation?",
      correct_answer: "wrapping up of data and members into a single unit" 
    },
    {
      question: "What is array?",
      correct_answer: "Array is datastructure stores data of same type"
    },
    {
      question: "What is polymorphism?",
      correct_answer: "Having many forms"
    },
    {
      question: "What is Artificial Intelligence?",
      correct_answer: "It is used for creating an intelligent machine that can behave like a human; it can solve any task."
    },
    {
      question: "What is the full form of SDLC",
      correct_answer: " Software Development Life Cycle"
    },
    {
      question: "Name some popular operating systems.",
      correct_answer: "Microsoft, OSX, Linux, and Windows are some popular operating systems"
    },
    {
      question: "Describe the difference between a stack and a queue",
      correct_answer: "A stack follows LIFO (Last In First Out) principle, while a queue follows FIFO (First In First Out) principle"
    },
    {
      question: "What is recursion?",
      correct_answer: "Recursion is a function that calls itself, creating a repetitive pattern to solve a problem"
    },
    {
      question: "What is a tree data structure?",
      correct_answer: "A tree is a hierarchical data structure where nodes are connected in a parent-child relationship."
    },
    {
      question: "What is time complexity",
      correct_answer: "Time complexity analyzes the execution time of an algorithm based on input size"
    },
    {
      question: "What is a hash table",
      correct_answer: "A hash table is a data structure that uses a hash function to map keys to storage locations"
    },
    {
      question: "What is call by value ",
      correct_answer: "a copy of value is passed to the function, so original value is not modified in the call by value."
    },
    {
      question: "what is call by reference",
      correct_answer: "an address of value is passed to the function, so original value is modified in the call by reference"
    },
    {
      question: "What is the use of printf()",
      correct_answer: "The printf() function is used to print the integer, character, float and string values on to the screen."
    },
    {
      question: "what is scanf() functions?",
      correct_answer: "The scanf() function is used to take input from the user."
    },
    {
      question: "What is recursion in C?",
      correct_answer: "When a function calls itself, and this process is known as recursion"
    },
    {
      question: "What is a pointer in C?",
      correct_answer: "A pointer is a variable that refers to the address of a value."
    },
    {
      question: "What is static memory allocation?",
      correct_answer: "memory is allocated at compile time, and memory can't be increased while executing the program."
    },
    {
      question: " What is dynamic memory allocation?",
      correct_answer: "memory is allocated at runtime and memory can be increased while executing the program"
    },
    {
      question: "what is  malloc()?",
      correct_answer: "The malloc() function allocates a single block of requested memory"
    },
    {
      question: "what is calloc()",
      correct_answer: "The calloc() function allocates multiple blocks of requested memory."
    },
    {
      question: " What is a union?",
      correct_answer: "The union is a user-defined data type that allows storing multiple types of data in a single unit."
    },
    {
      question: " What is a token?",
      correct_answer: "The Token is an identifier.A token is the smallest individual unit in a program"
    },
    {
      question: "What is an infinite loop?",
      correct_answer: "A loop running continuously for an indefinite number of times is called the infinite loop."
    },
    {
      question: "What is Python?",
      correct_answer: "Python is a high-level, interpreted programming language known for its simplicity and readability"
    },
    {
      question: "What is the use of the break statement?",
      correct_answer: "the break statement is used to exit or terminate a loop before a loop iteration is over when a specified condition is met"
    },
    {
      question: "What is tuple in python?",
      correct_answer: "A built-in type of data collection is the tuple."
    },
    {
      question: "what is Arithmetic Operators",
      correct_answer: "Perform mathematical operations which include addition(+), subtraction(-), multiplication(*), division(/), modulus(%)."
    },
    {
      question: "What is __init__?",
      correct_answer: "This method is automatically called to allocate memory when a new object/ instance of a class is created"
    },
    {
      question: "What is Java?",
      correct_answer: " Java is a high level, robust, object-oriented and secure programming language."
    },
    {
      question: "What is SQL?",
      correct_answer: "SQL stands for the Structured Query Language."
    },
    {
      question: "What are the usages of SQL?",
      correct_answer: "SQL is responsible for maintaining the relational data and the data structures present in the database. "
    },
    {
      question: "what are the subsets of SQL?",
      correct_answer: "DDL,DML,DCL,TCL"
    },
    {
      question: "What is the purpose of DDL Language?",
      correct_answer: "DDL stands for Data definition language. It is the subset of a database that defines the data structure of the database when the database is created."
    },
    {
      question: "What is the purpose of DML Language?",
      correct_answer: "Data manipulation language makes the user able to retrieve and manipulate data in a relational database"
    },
    {
      question: "What is the purpose of DCL Language?",
      correct_answer: "Data control language allows users to control access and permission management to the database"
    },
    {
      question: " What are tables in the database?",
      correct_answer: "A table is a set of organized data in the form of rows and columns"
    },
    {
      question: "What are fields in the database?",
      correct_answer: "Fields are the components to provide the structure for the table. It stores the same category of data in the same data type."
    },
    {
      question: "What is a primary key?",
      correct_answer: "A primary key is a field or the combination of fields that uniquely identify each record in the table"
    },
    {
      question: " What is a foreign key?",
      correct_answer: "The foreign key is used to link one or more tables together. It is also known as the referencing key."
    },
    {
      question: " What is a Database?",
      correct_answer: "A database is an organized collection of data that is structured into tables, rows, columns, and indexes."
    },
    {
      question: "What is meant by DBMS?",
      correct_answer: "DBMS stands for Database Management System. It is a software program that primarily functions as an interface between the database and the end-user."
    },
    {
      question: "What is RDBMS?",
      correct_answer: "RDBMS stands for Relational Database Management System."
    },
    {
      question: "What is Normalization in a Database?",
      correct_answer: "Normalization is used to minimize redundancy and dependency by organizing fields and table of a database."
    },
    {
      question: "Which are joins in SQL? ",
      correct_answer: "SQL joins are used to retrieve data from multiple tables into a meaningful result set."
    },
    {
      question: "What is INNER JOIN in SQL?",
      correct_answer: "Inner join returns only those records from the tables that match the specified condition and hides other rows and columns."
    },
    {
      question: " What is Full Join in SQL?",
      correct_answer: "The Full Join results from a combination of both left and right join that contains all the records from both tables."
    },
    {
      question: "What is the default ordering of data using the ORDER BY clause?",
      correct_answer: "The ORDER BY clause is used to sort the table data either in ascending or descending order"
    },
    {
      question: "What is HTML?",
      correct_answer: "HTML stands for Hyper Text Markup Language."
    },
    {
      question: "What is a style sheet?",
      correct_answer: "A style sheet is used to build a consistent, transportable, and well-designed style template."
    },
    {
      question: "What is CSS?",
      correct_answer: "CSS stands for Cascading Style Sheet. It is a popular styling language which is used with HTML to design websites"
    },
    {
      question: "What is inline style sheets?",
      correct_answer: " Inline Style Sheet is used to style only a small piece of code"
    },
    {
      question: "What is Embedded style sheets?",
      correct_answer: "Embedded style sheets are put between the <head>...</head> tags."
    },
    {
      question: "What is External style sheets?",
      correct_answer: "This is used to apply the style to all the pages within your website by changing just one style sheet."
    },
    {
      question: "What is the float property of CSS?",
      correct_answer: "The CSS float property is used to move the image to the right or left along with the texts to be wrapped around it."
    },
    {
      question: "What is JavaScript?",
      correct_answer: "JavaScript is a scripting language,It is widely used for client-side validation."
    },
    {
      question: "What is BOM?",
      correct_answer: "BOM stands for Browser Object Model. It provides interaction with the browser. "
    },
    {
      question: "What is the use of document object?",
      correct_answer: "A document object represents the HTML document."
    },
    {
      question: "What are the different data types present in JavaScript?",
      correct_answer: "Primitive data types and Non- Primitive data types"
    },
    {
      question: "What is an operating system?",
      correct_answer: "The operating system is a software program that facilitates computer hardware to communicate and operate with the computer software."
    },
    {
      question: "What is a socket?",
      correct_answer: "A socket is used to make connection between two applications. Endpoints of the connection are called socket."
    },
    {
      question: "What is a real-time system?",
      correct_answer: "Real-time system is used in the case when rigid-time requirements have been placed on the operation of a processor."
    },
    {
      question: "What is kernel?",
      correct_answer: "Kernel is the core and most important part of a computer operating system which provides basic services for all parts of the OS."
    },{
      question: "What is the concept of reentrancy?",
      correct_answer: "It is a very useful memory saving technique that is used for multi-programmed time sharing systems."
    },
    {
      question: "What is virtual memory?",
      correct_answer: "Virtual memory is a very useful memory management technique which enables processes to execute outside of memory."
    },
    {
      question: "What is a thread?",
      correct_answer: "A thread is a basic unit of CPU utilization. It consists of a thread ID, program counter, register set and a stack."
    },
    {
      question: "What is FCFS?",
      correct_answer: "FCFS stands for First Come, First Served"
    },
    {
      question: "What is deadlock?",
      correct_answer: "Deadlock is a specific situation or condition where two processes are waiting for each other to complete so that they can start."
    },
    {
      question: "What is Banker's algorithm?",
      correct_answer: "Banker's algorithm is used to avoid deadlock. It is the one of deadlock-avoidance method."
    },
    {
      question: "What is fragmentation?",
      correct_answer: "Fragmentation is a phenomenon of memory wastage. It reduces the capacity and performance because space is used inefficiently."
    },
    {
      question: "What is the network?",
      correct_answer: "A network is a set of devices that are connected with a physical media link."
    },
    {
      question: "What is network reliability?",
      correct_answer: "Network reliability means the ability of the network to carry out the desired operation through a network such as communication through a network."
    },
    {
      question: "What is bandwidth?",
      correct_answer: "The range of limit of network between its upper and lower frequency"
    },
    {
      question: "What is a node and link?",
      correct_answer: "This physical medium of connection is known as a link, and the computers that it is connected are known as nodes."
    },
    {
      question: "What is IP address?",
      correct_answer: "IP address is a unique 32 bit software address of a computer in a network system"
    },
    {
      question: "What is public IP address?",
      correct_answer: "A public IP address is an address taken by the Internet Service Provider which facilitates you to communication on the internet."
    },
    {
      question: "What is protocol?",
      correct_answer: "A protocol is a set of rules which is used to govern all the aspects of information communication."
    },
    {
      question: "What is the Domain Name System?",
      correct_answer: "The Domain Name System is the second type supporting program that is used by other programs such as to find the IP address of an e-mail recipient."
    },
    {
      question: "What is the usage of OSI physical layer?",
      correct_answer: "The OSI physical layer is used to convert data bits into electrical signals and vice versa."
    },
    {
      question: " Explain the peer-peer process.",
      correct_answer: "The processes on each machine that communicate at a given layer are called peer-peer process."
    },
    {
      question: "What is JVM?",
      correct_answer: "JVM stands for Java Virtual Machine it is a Java interpreter."
    },
    {
      question: "What is a ClassLoader?",
      correct_answer: "A classloader in Java is a subsystem of Java Virtual Machine, dedicated to loading class files when a program is executed"
    },
    {
      question: "What are the Memory Allocations available in Java?",
      correct_answer: "Java has five significant types of memory allocations Class Memory,Heap Memory,Stack Memory,Program Counter-Memory,Native Method Stack Memory"
    },
    {
      question: " What do you mean by aggregation?",
      correct_answer: "The term aggregation refers to the relationship between two classes best described as a whole/part and has-a relationship. "
    },
    {
      question: "Define Copy Constructor in Java",
      correct_answer: "A Copy Constructor in Java is a constructor that initializes an object through another object of the same class."
    },
    {
      question: " Define Wrapper Classes in Java.",
      correct_answer: "In Java, when you declare primitive datatypes, then Wrapper classes are responsible for converting them into objects(Reference types). "
    },
    {
      question: " Define package in Java.",
      correct_answer: "The package is a collective bundle of classes and interfaces and the necessary libraries and JAR files. "
    },
    {
      question: "What is an Exception?",
      correct_answer: "An Exception handling in Java is considered an unexpected event that can disrupt the program's normal flow"
    },
    {
      question: "Why is the main method static in Java?",
      correct_answer: "Java's main() function is static by default, allowing the compiler to call it either before or after creating a class object."
    },
    {
      question: "What is abstraction?",
      correct_answer: "Abstraction is a mechanism in which complex systems can be simplified by hiding unnecessary details"
    },
    {
      question: "What is a constructor?",
      correct_answer: "A constructor is a special method that is used to initialize objects. It has the same name as the class and does not have a return type."
    },
    {
      question: "What is exception handling?",
      correct_answer: "Exception handling is a mechanism in which errors or exceptions that occur during the program execution are caught and handled gracefully."
    },
    {
      question: "How is Multithreading achieved in Python?",
      correct_answer: "Multithreading in Python is achieved using the threading module, which allows you to run multiple threads (smaller units of a process) concurrently"
    },
    {
      question: "What is namespace in Python?",
      correct_answer: "A namespace is a naming system used to make sure that names are unique to avoid naming conflicts"
    },
    {
      question: ". What are functions in Python?",
      correct_answer: ": A function is a block of code which is executed only when it is called. To define a Python function, the def keyword is used."
    },
    {
      question: "What are Python packages?",
      correct_answer: ": Python packages are namespaces containing multiple modules"
    },
    {
      question: "What are Python libraries?",
      correct_answer: "Python libraries are a collection of Python packages"
    },
    {
      question: ".What is if statement?",
      correct_answer: "If the condition is true its body will execute otherwise does not execute"
    },
    {
      question: ".What is meant by for loop?",
      correct_answer: "For loop is used to iterate over a sequence list, string, tuple, etc.,"
    },
    {
      question: ".What is count function in list?",
      correct_answer: "This method counts the number of occurrence of particular item in a list"
    },
    {
      question: "What is function overriding?",
      correct_answer: "Function with same name and same parameters is called function overriding."
    },
    {
      question: "what is parent class?",
      correct_answer: "The class which is inherited by another class is called parent or base class."
    },
    {
      question: ".What is Child class?",
      correct_answer: "The class which inherits the property of another class is called child or sub or derived class"
    },
    {
      question: "What operations can be performed on a stack?",
      correct_answer: "push(),pop(),peek(),empty(),size(),"
    },
    {
      question: "Explain what multidimensional arrays is",
      correct_answer: "A multidimensional array spans across more than one dimension, which means it has more than one index variable for each storage point."
    },
    {
      question: "What is a linked list data structure?",
      correct_answer: "A linked list data structure is a sequence of elements that are not stored in adjacent memory locations."
    },

    {
      question: "What is a doubly-linked list?",
      correct_answer: "The doubly-linked list is a double-ended complex linked list with two links in a node"
    },
    {
      question: ". What is an algorithm?",
      correct_answer: "An algorithm shows a step-by-step process to solve a problem or manipulate data. "
    },
    {
      question: "What is a queue data structure?",
      correct_answer: "A queue data structure supports systematic operations, i.e., elements are accessed and manipulated in a specific order"
    },
    {
      question: "What is a priority queue?",
      correct_answer: "A priority queue is a type of abstract data resembling a normal queue, but here, each element is assigned a priority value"
    },
    {
      question: "What is the merge sort?",
      correct_answer: "Merge sort is based on the divide and conquer method. Here, the data is divided and sorted to attain the end goa"
    },
    {
      question: "What is dynamic memory management?",
      correct_answer: "In the dynamic memory management technique, storage units are allocated according to the requirements."
    },
    {
      question: "What is a postfix expression?",
      correct_answer: "Post-fix expression consists of operators and operands, and every operator precedes the operands"
    },
    {
      question: "What is a binary tree?",
      correct_answer: "A binary tree is used to organise data, making data retrieval and manipulation efficient."
    },
    {
      question: ". What is a graph data structure?",
      correct_answer: "It is a non-linear data structure with nodes or vertices connected by a set of ordered edges"
    },
    {
      question: " How does bubble sort work?",
      correct_answer: "A bubble sort is a commonly-used sorting method appalled to arrays where adjacent elements are compared to each other"
    },
    {
      question: "What is a heap data structure?",
      correct_answer: "Heap is a unique tree-based non-linear data structure with a complete binary tree"
    },
    {
      question: "Define Red-Black Tree.",
      correct_answer: "Each node is either red or black, and by comparing these colours on a path from root to leaf,the tree ensures that the path is not more than twice as long as others, making it balanced"
    },
    {
      question: "What is tower of hanoi?",
      correct_answer: "Tower of Hanoi, is a mathematical puzzle which consists of three tower pegs and more than one rings."
    },
    {
      question: "What is fibonacci series?",
      correct_answer: "Fibonacci Series generates subsequent number by adding two previous numbers"
    },
    {
      question: "What is a recursive function?",
      correct_answer: "A recursive function is one which calls itself, directly or calls a function that in turn calls it"
    },
    {
      question: "Explain what is Computer Architecture?",
      correct_answer: "Computer architecture is a specification detailing about how a set of software and hardware standards interacts with each other to form a computer system or platform."
    },
    {
      question: "What is pipelining?",
      correct_answer: "the process of collecting instruction from the processor through a pipeline. It stores and executes instructions in an orderly process."
    },
    {
      question: "What is a cache?",
      correct_answer: "A cache is a small amount of memory, which is a part of the CPU."
    },
  ];