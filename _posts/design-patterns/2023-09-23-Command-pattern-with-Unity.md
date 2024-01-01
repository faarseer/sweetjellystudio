---
layout: post
title:  "Command Pattern With Unity"
author: SWeetJelly
categories: [ c#, design pattern, unity ]
image: assets/images/5.jpg
---

> The Command design pattern encapsulates a request as an object, thereby letting you parameterize clients with different requests, queue or log quests, and support undo-able operations.

![uml-command](/assets/images/uml-command.png)

- Command
  - declares an interface for executing an operation
- ConcreteCommand
  - defines a binding between a Receiver object and an action
  - implements Execute by invoking the corresponding operation(s) on Receiver
- Client
  - creates a ConcreteCommand object and sets its receiver
- Invoker
  - asks the command to carry out the request
- Receiver
  - knows how to perform the operations associated with carrying out the request

## Implementation in Unity

```csharp
namespace Command
{
    /// <summary>
    /// The 'Command' class
    /// </summary>
    public class Command
    {
        public Command()
        {}
        public virtual void Execute(Receiver receiver)
        {}
        public virtual void Undo(Receiver receiver)
        {}
        public virtual void Redo(Receiver receiver)
        {}
    }

    /// <summary>
    /// The 'Idle Command' class
    /// </summary>
    public class IdleCommand : Command
    {
        public override void Execute(Receiver receiver)
        {
            //receiver.HandleInput(this);
            receiver.Idle();
        }
    }
}
```

```csharp
namespace Command
{
    /// <summary>
    /// The 'Client' class
    /// </summary>
    public class Client : MonoBehaviour
    {
        InputHandler inputHandler;
        void Start()
        {
            inputHandler = new InputHandler(new ConcreteReceiver());
        }

        public void OnMove(InputAction.CallbackContext context)
        {
            if(context.performed)
            {
                Vector2 _input = context.ReadValue<Vector2>();
                if(_input.y > 0)
                    inputHandler.Action(new MoveCommand(Vector2.up));
                if(_input.y < 0)
                    inputHandler.Action(new MoveCommand(Vector2.down));
                if(_input.x > 0)
                    inputHandler.Action(new MoveCommand(Vector2.right));
                if(_input.x < 0)
                    inputHandler.Action(new MoveCommand(Vector2.left));
            }
        }

        public void OnJump(InputAction.CallbackContext context)
        {
            if(context.performed)
            {
                inputHandler.Action(new JumpCommand());
            }
        }
    }
}
```

```csharp
namespace Command
{
    /// <summary>
    /// The 'Invoker' class
    /// </summary>
    public class InputHandler
    {
        public InputHandler(Receiver receiver)
        {
            ProvideReceiver(receiver);
        }

        protected static Command idle = new IdleCommand();

        public void ProvideReceiver(Receiver receiver)
        {
            this.receiver = receiver;
        }
        public virtual void Action(Command command)
        {
            command?.Execute(receiver);
        }
    }
}
```

```csharp
namespace CommandPattern
{
    /// <summary>
    /// The 'Receiver' class
    /// </summary>
    public class Receiver
    {
        protected Vector2 m_position;
        public Receiver()
        {
            m_position = Vector2.zero;
        }
        public virtual void Idle()
        {}
        public virtual void Jump()
        {}
        public virtual void Move(Vector2 deltaPos)
        {}
    }

    /// <summary>
    /// The 'Concrete Receiver' class
    /// </summary>
    public class ConcreteReceiver : Receiver
    {
        public override void Idle()
        {
            Debug.Log("Receiver Idle");
        }
        public override void Jump()
        {
            Debug.Log("Receiver Jump");
        }
        public override void Move(Vector2 deltaPos)
        {
            m_position += vector2;
            Debug.Log($"Receiver Move : {position}");
        }
    }
}
```
