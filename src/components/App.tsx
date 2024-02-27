import { filter, forEach, includes, map, padStart, sortBy } from "lodash";
import * as React from "react";
import { useEffect, useState } from "react";
import "./App.scss";

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

const getData = async (year = 2021) => {
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
  const [today, setToday] = useState(new Date().toISOString().split("T")[0]);

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

  let games = search.fullText
    ? filter(data, (g: Game) =>
        includes(
          [g.h.ta, g.h.tn, g.h.tc, g.v.ta, g.v.tn, g.v.tc],
          search.fullText
        )
      )
    : data;

  return (
    <div>
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
        map(games, (game) => (
          <Game
            key={game.gid}
            game={game}
            today={today}
            showScore={search.showScores}
          />
        ))
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
}

export const Game = ({ game, today, showScore }: GameProps): JSX.Element => {
  return (
    <div className="game">
      <span
        id={game.gdtutc}
        style={{
          color:
            game.gdtutc < today
              ? "gray"
              : game.gdtutc == today
              ? "red"
              : "black",
        }}
      >
        [{game.gdtutc} {game.utctm}]{" "}
      </span>
      <strong>{game.v.ta}</strong>{" "}
      {showScore ? (
        <span className="game--score">
          {padStart(game.v.s, 3, " ")} - {padStart(game.h.s, 3, " ")}
        </span>
      ) : (
        "@"
      )}{" "}
      <strong>{game.h.ta}</strong>{" "}
    </div>
  );
};