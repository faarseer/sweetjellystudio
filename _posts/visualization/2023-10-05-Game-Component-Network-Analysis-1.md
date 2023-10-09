---
layout: post
title:  "Network Analysis of Deck Building Game, Part 1"
author: SWeetJelly
categories: [ class ]
image: assets/game-analysis/slaythespire-ironclad-network-degree-centrality.png
featured: true
---

# Network Analysis of Deck Building Game, Part 1

덱빌딩 게임 성분 네트워크 분석입니다.

들어가기 앞서, 사용한 중심성 측정 기법들을 짧게 짚고 갑시다.

## Degree Centrality

노드가 얼마나 많은 엣지와 연결되어있는지를 Degree 라고 하고, 표준화된 값으로 나타내기 위해 `n-1`, `n` 은 노드의 개수, 로 나누어 주면 Degree Centrality 를 구할 수 있습니다.

d_{i}를 `i` 노드가 연결된 엣지의 개수라고 합시다. 그리고 n을 노드의 개수라고 하면,

$$
D_{i} = \frac{d_{i}}{n-1}
$$

## Closeness Centrality

그래프의 다른 모든 노드들과 얼마나 가까운지로 각 노드의 Centrality 를 결정하는 것을 `Closeness Centrality` 라고 합니다.

$d_{ij}$ 를 *i* and *j* 노드의 가장 가까운 거리라고 합시다.

그리고 $l_{i}$ *i* 의 평균 노드간 거리라고 하면,

$$
l_{i} = \frac{1}{n} \sum_{j} d_{ij}
$$

가 되겠죠.

그러나 얼마나 가까운지는 얼마나 먼 지의 반대이기 때문에,

$$
C_{i} = \frac{1}{l_{i}} = \frac{n}{\sum_{j} d_{ij}}
$$

$C_{i}$ 는 그 역수가 됩니다.

## Betweenness Centrality

다른 노드들과의 엣지가 얼마나 중요한 연결이였느냐를 따지는 것이 이 노드의 중심성의 측정의 기준이 됩니다.

`h`, `i`, `j` 를 노드, $sigma_{h}{j}$ 를 `h`, `j`의 가장 짧은 길의 개수, $sigma{h}{j}(i)$ 를 노드 `i` 를 포함한 `h`, `j`의 가장 짧은 길의 개수라고 하면,

$$
B_{i} = \sum_{h \ne j \ne i} \frac{\sigma_{hj}(i)}{\sigma_{hj}}
$$

## EigenVector Centrality

노드와 연결된 다른 노드들의 중요성을 이 노드의 중심성의 측정 기준으로 보는 겁니다.

그래프 G에 대해서 노드 N, 엣지 E,
$M(i)$ 를 노드 `i`의 연결된 노드들의 집합, $X_{j}$ 를 노드`i`와 연결되었다면 1, 그렇지 않은 경우 0이라고 하면,

$$
X_{i} = \frac{1}{\lambda} \sum_{j \in M(i)} X_{j} = \frac{1}{\lambda} \sum_{j \in G} a_{i,j}X_{j}
$$

## Dataset

하나의 직업의 게임 성분 네트워크를 분석해 볼 것입니다.

데이터는 `Name`, `Enforce`, `Rarity`, `Type`, `Energy`, `Effect` 등을 가지고 있고,

The Dataset

- 'ironclad.csv' contains 'Name', 'Enforce', 'Rarity', 'Type', 'Energy', 'Effect', 'Weight' of cards.

Nodes:

- Name : name of cards
- Effects : effect component of cards

Links:

one way links from effect to card.

## 결과

![attack-network](assets/game-analysis/slaythespire-ironclad-attack-network.png)

![skill-network](assets/game-analysis/slaythespire-ironclad-skill-network.png)

공격 지향적인 카드의 개수가 많고, 정직하게 강한 카드들이 많다는 것, 높은 밸류의 공격 카드들이 많다는 것. 조건들이 특수하지 않고 범용성이 높다는 것.

`소멸`의 특성이 생각보다 중요하다 > 덱 압축 > 키 카드들의 회전률을 높이는 것.

다른 직업들과 다르게 덱의 방향성을 설정하는 것이 생각보다 쉬우며, 난이도가 낮다는 점. 승률 1위

완성되지 않은 덱 컨셉이더라도 중간의 보스들을 높은 밸류들의 카드로 어느정도 클리어 할 수 있다는 점.

완성도가 높은 캐릭터.

가장 균형잡힌 캐릭터 > 범용성이 높다 라고 볼 수 있다는 것

`Attack` 타입의 카드와 `Skill` 타입의 카드에서 범용성이 높게 나오는 `Exhaust` 와 달리, `Power` 에서는 그렇지 못함.

`Skill` 에서 범용성이 높은 효과들 : `Gain Block`, `Exhaust`, `Draw Card`
`Attack` 에서 범용성이 높은 효과들 : 

`Skill` 에서 생성된 서브 그래프 효과 : `Gain Strength`
사용하기에 카드 수가 너무 적음 : `Create Card`

바리케이드의 경우 `Gain Block`을 따로 효과로 넣어놓지 않아서 따로 떨어져 있는 것으로 보이지만, 사실상 `Gain Block` 쪽으로 봐도 되긴하다. 그러나 실제로 바리케이드가 크게 중요하지 않다고 보는 플레이어들도 많다.

티어리스트와 비교 < 카드 효과의 웨이트를 따질 수가 없었기 때문에 이부분은 조금 차이 있을 수 있다.

생성 쪽의 효과 종류가 부족해서 랜덤성이 떨어진다.

`Attack` 에서는 `Draw` 종류의 효과들이 범용성이 높지만, `Skill` 과 `Power` 에서는 중심성이 낮기 때문에 생각보다 패말림 현상이 잘 일어난다고 볼 수 있다.

`Attack` 에서 `Exhaust` 와 관련해서 덱 컨셉을 유지하는 것이 범용성(안정성)과 높은 데미지 포텐셜을 가질 것으로 유추된다.

외곽에 위치한 효과들이 많은데, 덱 빌딩 게임의 특성상 한 카드가 여러가지 효과를 가지지만 카드들의 특성을 나타내기 위해 조금 개성있는 효과들이 같이 존재

![degree-rank](assets/game-analysis/slaythespire-ironclad-degree-rank.png)

![histogram-rank](assets/game-analysis/slaythespire-ironclad-degree-histogram.png)

각 중심성 분석 별 효과 탑 5, 카드 탑 5 리스트

히스토그램, 랭크를 통한 노드의 연결 개수가 엄청 많지는 않음. 단조로운 편

![degree-centrality](assets/game-analysis/slaythespire-ironclad-network-degree-centrality.png)
![betweenness-centrality](assets/game-analysis/slaythespire-ironclad-network-betweenness-centrality.png)
![eigenvector-centrality](assets/game-analysis/slaythespire-ironclad-network-eigenvector-centrality.png)

EigenVector 중심성 분석을 통해 카드들을 골라낼 수 있다는 점. 한 카드가 여러가지 효과를 가진다는 것을 명확히 보여줌. 코어 효과들이 존재.

나눠 보지 않고 다같이 보게되면, `Gain Block`, `Exhaust`, `Gain Strength` 쪽 정도로 볼 수 있음.
컨셉을 끌고 갈 만큼 다양한 루트가 존재하진 않음. 기본적으로 범용성이 높고 밸류가 높은 것으로 추정된다.

## 마치며

해당 게임의 다른 직업들 또한 네트워크 분석을 해서 게임 성분 네트워크 분석이 밸런싱이나 게임 기획에 영향이 있다는 걸 명시
