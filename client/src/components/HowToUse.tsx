import React from 'react';

export default function HowToUse() {
    return (
        <div className="p-8">
            <h1 className="text-4xl font-bold underline mb-8 text-center">
                Frequently Asked Questions
            </h1>
            <h2 className="text-2xl font-bold underline mb-4 text-center">
                How can I use it?
            </h2>
            <p className="mb-4">
                This app is a simple stopwatch app that allows you to track the time you spend on different tasks.
            </p>
            <p className="mb-4">
                You can start by finding out the perfect time to cook your favorite popcorn or how long it takes you to finish a book.
            </p>
            <p className="mb-4">
                You can also use it to track your work hours or time spent on a project.
            </p>
            <ol className="list-decimal list-inside mb-8">
                <li className="mb-2">Create a stopwatch for a task you want to track</li>
                <li className="mb-2">Click on the Start button when and enjoy the task</li>
                <li className="mb-2">When you're finished remember to click stop</li>
                <li className="mb-2">In the entries section you will find your time saved as well as some quick statistics for you to ponder</li>
            </ol>
            <h2 className="text-2xl font-bold underline mb-4 text-center">
                How it works
            </h2>
            <p className="mb-4">
                You can add as many stopwatches as you like and start and stop them individually.
            </p>
            <p className="mb-4">
                When a stopwatch is stopped, the time spent on that task is recorded and stored in the cloud.
            </p>
            <p className="mb-4">
                You can view the time spent on each task by clicking on the stopwatch name.
            </p>
        </div>
    );
}