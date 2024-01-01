---
layout: post
title:  "Template Pattern With Unity"
author: SWeetJelly
categories: [ c#, design pattern, unity ]
image: assets/images/5.jpg
---

The Template Method design pattern defines the skeleton of an algorithm in an operation, deferring some steps to subclasses. This pattern lets subclasses redefine certain steps of an algorithm without changing the algorithm‘s structure.

@startuml

class AbstractClass {
    + templateMethod()
    # subMethod()
}

class ConcreteClass {
    + subMethod()
}

hide empty members

AbstractClass <|-- ConcreteClass

@enduml

## With Unity

{% highlight csharp %}
using UnityEngine;

namespace Template
{
    /// <summary>
    /// The 'Abstract' Class
    /// </summary>
    public abstract class ChessPiece
    {
        public enum ChessPieceType
        {
            None,
            Pawn,
            Knight
        }

        protected ChessPieceType chessPieceType;
        public void EnterCell(ChessPiece piece)
        {
            piece.Die();
        }
        public void Die()
        {
            Debug.Log($"{chessPieceType} dead");
        }
        public abstract void PlayTurn();
    }
}
{% endhighlight %}

{% highlight csharp %}
using UnityEngine;

namespace Template
{
    public class ChessPawn : ChessPiece
    {
        public ChessPawn()
        {
            this.chessPieceType = ChessPieceType.Pawn;
        }

        public override void PlayTurn()
        {
            Debug.Log($"Pawn Moves");
        }
    }
}
{% endhighlight %}