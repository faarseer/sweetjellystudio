---
layout: post
title:  "Template Pattern With Unity"
author: SWeetJelly
categories: [ c#, design pattern, unity ]
image: assets/images/5.jpg
---

## Introduction

Template Method 패턴은 메서드의 뼈대만 정의하고 일부 단계를 서브 클래스에 미루어주는 상속을 사용하는 디자인 패턴입니다. 이를 통해 일부 알고리즘의 고정된 부분을 한 번 정의하고, 서브 클래스가 변하는 부분을 구현할 수 있게 합니다. Unity 에서 이 패턴은 게임 오브젝트의 행동을 표준화하면서 유연성을 희생하지 않기 위해 사용할 수 있습니다. 그러나 생각보다 중복이나 사용하지 않는 부분의 코드가 늘기 때문에 추천하지는 않습니다.

## What is Template method pattern

템플릿 메서드 패턴은 알고리즘의 스켈레톤을 설정하는 템플릿 메서드를 정의하는 추상 클래스를 중심으로 합니다. 템플릿 메서드는 일련의 다른 메서드를 호출하며, 이 중 일부는 추상적일 수 있고 서브클래스에서 구현해야 할 수 있습니다. 이 디자인 패턴은 코드 중복을 줄이고 일관된 실행 순서를 보장하는 데 도움이 됩니다.

![]({{ site.baseurl }}/assets/images/DesignPatterns/template-method-uml.png)

## Implement With Unity

다양한 유형의 체스 말을 구현해봅시다. 각 말은 일부 공통 행동을 공유하지만, 특정 행동이 필요한 고유한 동작도 있습니다.

간단하게 체스말이라는 구상 클래스에서 체스말타입을 정의하고 모두 체스말타입을 가지게 한다.

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

        public void EnterCell(Cell cell)
        {
            HandleCellEntry();

            if(cell.Piece != null)
                cell.Piece.Die();
        }

        protected virtual void HandleCellEntry()
        {

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

이 예제에서 'ChessPiece' 는 추상 클래스로서 템플릿 메서드 'EnterCell()'을 구현하며, 이 메서드는 말이 셀에 들어갔을 때의 행동 순서를 개략적으로 정의합니다. 'Die()' 메서드는 기본 구현을 제공하며 'ChessPawn' 과 같은 서브클래스에서는 특정 행동을 정의하며 오버라이드 할 수 있습니다.

## Conclusion

템플릿 메서드 패턴은 unity에서 게임 메커닉을 설계할 때 구조화된 접근 방식을 제공하며, 일관된 알고리즘 프레임워크를 구현하면서 필요에 따라 개별 단계를 수정할 수 있는 유연성을 부여합니다. 이 패턴을 사용함으로써 게임 개발자는 객체가 동일한 생명주기 또는 일련의 행동을 따르도록 하여 일관성을 유지하고 버그를 줄일 수 있습니다.
