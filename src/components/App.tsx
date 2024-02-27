import forEach from "lodash/forEach";
import join from "lodash/join";
import map from "lodash/map";
import padStart from "lodash/padStart";
import sortBy from "lodash/sortBy";

import React, { useEffect, useState } from "react";

interface Game {
  gid: string;
  gcode: string;
  gdte: string;
  etm: string;
  gdtutc: string;
  utctm: string;
  h: GameTeam;
  v: GameTeam;
}

interface GameTeam {
  tid: number;
  re: string;
  ta: string;
  tn: string;
  tc: string;
  s: string;
}

interface Search {
  fullText?: string;
  showScores: boolean;
}

const getData = async (year = 2023) => {
  const url = `https://data.nba.com/data/10s/v2015/json/mobile_teams/nba/${year}/league/00_full_schedule.json`;
  const response = await fetch(url);
  const { lscd } = await response.json();
  const games: Game[] = [];

  forEach(lscd, ({ mscd }) => {
    forEach(mscd.g, (game) => {
      games.push(game);
    });
  });

  return sortBy(games, "etm");
};

export const App = (): JSX.Element => {
  const [data, setData] = useState([]);
  const [fetched, setFetched] = useState(false);
  const [search, setSearch] = useState({ showScores: false } as Search);
  const [today, _setToday] = useState(new Date().toISOString().split("T")[0]);

  useEffect(() => {
    const fetchData = () => {
      getData().then((data) => {
        setData(data);
        setFetched(true);
        console.log(data);
      });
    };
    fetchData();
  }, [today]);

  const onTeamFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch((search) => {
      return { ...search, fullText: e.target.value };
    });
  };

  const onShowScore = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch((search) => {
      return { ...search, showScores: e.target.checked };
    });
  };

  const games = data;

  const isGameVisible = (g: Game) =>
    !search.fullText ||
    join([g.h.ta, g.h.tn, g.h.tc, g.v.ta, g.v.tn, g.v.tc], "|")
      .toLowerCase()
      .includes(search.fullText.toLowerCase());

  let dayCursor: string;

  return (
    <div className="container">
      <fieldset>
        <label htmlFor="team_filter">
          Filter by team:{" "}
          <input name="team_filter" type="text" onChange={onTeamFilter} />
        </label>
      </fieldset>
      <fieldset>
        <label htmlFor="show_scores">
          Show scores:{" "}
          <input name="show_scores" type="checkbox" onChange={onShowScore} />
        </label>
      </fieldset>
      <p>
        <a href={`#${today}`}>Go to Today</a>
      </p>
      {fetched ? (
        map(games, (game: Game) => {
          let dayHeader;

          if (dayCursor != game.gdtutc) {
            dayHeader = <div id={game.gdtutc} className="date-anchor"></div>;
            dayCursor = game.gdtutc;
          }

          return (
            <React.Fragment key={game.gid}>
              {dayHeader}
              <Game
                game={game}
                today={today}
                showScore={search.showScores}
                hidden={!isGameVisible(game)}
              />
            </React.Fragment>
          );
        })
      ) : (
        <p>Fetching Games...</p>
      )}
    </div>
  );
};

interface GameProps {
  game: Game;
  showScore: boolean;
  today: string;
  hidden: boolean;
}

export const Game = ({
  game,
  today,
  showScore,
  hidden,
}: GameProps): JSX.Element => {
  const timeClass =
    game.gdtutc < today ? "past" : game.gdtutc == today ? "current" : "";

  return (
    <div className="game" style={hidden ? { display: "none" } : null}>
      <span className={`game--date ${timeClass}`}>
        [{game.gdtutc} {game.utctm}]
      </span>

      <strong>{game.v.ta}</strong>

      {showScore ? <GameScore visitor={game.v.s} home={game.h.s} /> : "@"}

      <strong>{game.h.ta}</strong>
    </div>
  );
};

interface GameScoreProps {
  visitor: string;
  home: string;
}

const GameScore = ({ visitor, home }: GameScoreProps): JSX.Element => {
  return (
    <span className="game--score">
      {padStart(visitor, 3, " ")} - {padStart(home, 3, " ")}
    </span>
  );
};
