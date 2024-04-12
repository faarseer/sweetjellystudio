---
layout: post
title:  "State Pattern With Unity"
author: SWeetJelly
categories: [ c#, design pattern, unity ]
image: assets/images/5.jpg
---

## Introduction

상태 패턴은 객체가 내부 상태가 변경될 때 행동을 변경할 수 있도록 하는 행동 디자인 패턴입니다. 게임 개발에서 이 패턴은 게임 캐릭터, UI 요소, 게임 시나리오의 복잡한 상태 전환을 관리하는데 유용합니다. 상태별 행동을 상태 객체 내에 캡슐화함으로써, 상태 패턴은 게임 구성 요소의 핵심 기능과 얽히지 않고 게임 로직을 확장하고 수정하기 쉽게 만듭니다.

## What is State Pattern

상태 패턴은 객체가 내부 상태에 따라 다르게 행동할 수 있도록 합니다. 이를 달성하기 위해 각 상태를 자체 행동을 캡슐화하는 객체로 취급합니다. 복잡한 if-else문을 사용하여 행동을 제어하는 대신, 상태 패턴은 각 상태를 나타내는 클래스를 사용하고 상태 객체가 변경됨에 따라 행동이 달라지는 컨텍스트 객체를 사용합니다.

![]({{ site.baseurl }}/assets/images/DesignPatterns/state-uml.png)

## Implement State Pattern In Unity

유니티 환경에서 상태 패턴을 적용할 경우, 보통 해당 오브젝트가 게임 오브젝트이며 MonoBehaviour 을 사용하는 경우가 많다.

MonoBehaviour 은 다양한 빌트인 이벤트를 트리거하게된다.

상태 머신과 MonoBehaviour 연결을 하는 것이 하나의 목표가 된다.

{% highlight csharp %}
namespace State
{

    public abstract class BaseStateBehaviour
    {
        public abstract void OnStateRegistered();
        public abstract void OnStateActivated();
        public abstract void OnStateDisabled();

        public abstract void Update();
    }
    public abstract class StateBehaviour<T> : BaseStateBehaviour
    {
        protected T stateMachine;

        public T StateMachine=> stateMachine;

        public StateBehaviour(T stateMachine)
        {
            this.stateMachine = stateMachine;
        }
    }
}
{% endhighlight %}

{% highlight csharp %}
namespace State
{
    public abstract class StateMachineController<K, T> where K : MonoBehaviour
    {
        private T currentState;
        public T CurrentState => currentState;

        private List<BaseStateBehaviour> stateBehaviours;
        private Dictionary<T, int> stateBehavioursLink;
        private int statesCount;
        private BaseStateBehaviour activeStateBehaviour;
        public BaseStateBehaviour ActiveStateBehaviour => activeStateBehaviour;
        private K parentBehaviour;
        public K ParentBehaviour => parentBehaviour;

        public void Initialise(K parentBehaviour, T defaultState)
        {
            this.parentBehaviour = parentBehaviour;

            // Reset variables
            stateBehaviours = new List<BaseStateBehaviour>();
            stateBehavioursLink = new Dictionary<T, int>();
            statesCount = 0;

            // Register and initialise states
            RegisterStates();

            // Enable default state
            SetState(defaultState);
        }

        protected void RegisterState(BaseStateBehaviour stateBehaviour, T state)
        {
            stateBehaviours.Add(stateBehaviour);
            stateBehavioursLink.Add(state, statesCount);

            statesCount++;

            stateBehaviour.OnStateRegistered();
        }

        public void SetState(T state)
        {
            if (!currentState.Equals(state))
            {
                // Disable current state
                if (activeStateBehaviour != null)
                    activeStateBehaviour.OnStateDisabled();

                // Rewrite current state
                currentState = state;
                activeStateBehaviour = stateBehaviours[stateBehavioursLink[currentState]];

                // Activate new state
                activeStateBehaviour.OnStateActivated();
            }
        }

        public BaseStateBehaviour GetState(T state)
        {
            return stateBehaviours[stateBehavioursLink[state]];
        }

        protected abstract void RegisterStates();
    }
}
{% endhighlight %}

위의 제네릭 클래스들을 사용해 필요한 클래스를 만들면 된다.

1. State History
2. Multiple States

## Conclusion

상태 패턴은 결국 게임 요소들이 원활하고 관리가능한 상태 전환을 가능하도록 한다. 항상 하는 말이지만, 이는 더 모듈화되고 확장 가능한 시스템을 만들 수 있도록 해주며, 곧 더 나은 아키텍처와 향상된 게임 플레이로 이어진다.
