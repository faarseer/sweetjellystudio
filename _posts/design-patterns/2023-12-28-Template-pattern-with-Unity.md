---
layout: post
title:  "Template Pattern With Unity"
author: SWeetJelly
categories: [ c#, design pattern, unity ]
image: assets/images/5.jpg
---

Template Method 패턴은 Inheritance 를 어떻게 사용해야 하는지를 알려주는 패턴이다.

![]({{ site.baseurl }}/assets/images/DesignPatterns/template-method-uml.png)

## Implement With Unity

체스 말을 구현한다고 하자. 간단하게 체스말이라는 구상 클래스에서 체스말타입을 정의하고 모두 체스말타입을 가지게 한다.

또한 어떤 셀에 위치하게 되면 어떤 일이 벌어지는지 공통으로 정의한다.

그러나 말이 죽는 것이나 플레이하는 방식은 구체 클래스에서 재정의함으로써 구체 클래스에 특정 구현을 미룰 수 있다.

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
        public virtual void Die()
        {
        }
        public abstract void PlayTurn();
    }
}
{% endhighlight %}

{% highlight csharp %}
using UnityEngine;

namespace Template
{
    /// <summary>
    /// The 'Concrete' Class
    /// </summary>
    public class ChessPawn : ChessPiece
    {
        public ChessPawn()
        {
            this.chessPieceType = ChessPieceType.Pawn;
        }

        public override void Die()
        {
            Debug.Log("Pawn Dead");
        }

        public override void PlayTurn()
        {
            Debug.Log($"Pawn Moves");
        }
    }
}
{% endhighlight %}
