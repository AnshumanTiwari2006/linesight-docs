// Auto-generated API Documentation Database for LineSight Docs
const API_DATA = {
  "CORE_METHODS": {
    "predict": {
      "name": "predict",
      "signature": "model.predict(X)",
      "category": "core",
      "models": [
        "All Models"
      ],
      "source": "regression/linear/engine/predict.py",
      "shortDesc": "Generate predictions for input features using the trained model.",
      "longDesc": "Uses the learned slope `m` and intercept `b` to compute predictions via the equation `ŷ = m·x + b`. The model must have been fitted first.\n\nInput validation ensures the feature count matches what the model was trained on. For example, if you trained on 1 feature but pass 3 features at prediction time, a `LineSightShapeError` is raised with a clear explanation.\n\nFor LogisticRegression, this returns binary class labels (0 or 1) rather than continuous values.\n\n**When to use**: After calling `fit()`, use `predict()` to generate predictions on new, unseen data. This is the core \"inference\" step — the model applies what it learned during training to make predictions on data it hasn't seen before.\n\n**How it works internally**: The computation is a simple vectorized operation: `y_hat = m * X.ravel() + b`. For n samples, this is a single NumPy multiplication + addition (O(n) time). No gradients are computed — prediction is nearly instantaneous regardless of dataset size.\n\n**Edge cases**: Passing data with a different number of features than what the model was trained on will raise a descriptive error. Passing NaN or Inf values in X will also raise an error before any computation occurs.",
      "parameters": [
        {
          "name": "X",
          "type": "array-like, shape (n_samples,) or (n_samples, 1)",
          "default": null,
          "required": true,
          "desc": "Feature matrix for prediction. Must have the same number of features as the training data. 1-D arrays are reshaped to (n, 1)."
        }
      ],
      "returns": {
        "type": "np.ndarray, shape (n_samples,)",
        "desc": "Predicted y values. For regression: continuous values. For LogisticRegression: binary labels (0 or 1)."
      },
      "raises": [
        {
          "exception": "LineSightNotFittedError",
          "condition": "`fit()` has not been called yet",
          "message": "\"Call fit(X, y) before calling predict().\""
        },
        {
          "exception": "LineSightShapeError",
          "condition": "X has a different number of features than training data",
          "message": "\"Model trained on {n} feature(s), but X has {m} feature(s).\""
        },
        {
          "exception": "LineSightShapeError",
          "condition": "X contains NaN or Inf values",
          "message": "\"X contains NaN values. Clean your data before training.\""
        }
      ],
      "warns": [],
      "internalSteps": [
        "Check that model is fitted via `_check_fitted('predict')`",
        "Validate X shape and feature count via `_validate_X()`",
        "Compute `y_hat = m * X.ravel() + b`",
        "Return the predictions array"
      ],
      "mathFormula": "ŷ = m · x + b\n\nwhere:\n  m = learned slope (coef_)\n  b = learned intercept (intercept_)\n  x = input feature values",
      "example": "# After fitting\ny_pred = model.predict(X)\nprint(y_pred[:5])  # First 5 predictions\n\n# Predict on new data\nX_new = np.array([[5.0], [7.5], [10.0]])\npredictions = model.predict(X_new)\nprint(predictions)  # [≈13.5, ≈19.75, ≈26.0]",
      "inputExample": "# Model already fitted with slope ≈ 2.5, intercept ≈ 1.0\n# Predict on 3 new data points:\n\nX_new = np.array([[2.0], [5.0], [8.0]])\ny_pred = model.predict(X_new)",
      "outputExample": "# Return value: np.ndarray, shape (3,)\n\ny_pred → array([6.0000, 13.5000, 21.0000])\n\n# Breakdown:\n#   x=2.0 → 2.5 × 2.0 + 1.0 = 6.0\n#   x=5.0 → 2.5 × 5.0 + 1.0 = 13.5\n#   x=8.0 → 2.5 × 8.0 + 1.0 = 21.0\n\ntype(y_pred) → numpy.ndarray\ny_pred.shape → (3,)",
      "seeAlso": [
        "fit",
        "score"
      ]
    },
    "score": {
      "name": "score",
      "signature": "model.score(X, y)",
      "category": "core",
      "models": [
        "All Regression Models"
      ],
      "source": "regression/linear/engine/score.py",
      "shortDesc": "Compute all regression metrics and return as a dictionary.",
      "longDesc": "Evaluates the model's predictions against actual values and returns a dictionary of standard regression metrics. All values are rounded to 6 decimal places for readability.\n\nFor regression models, the returned metrics are MSE, RMSE, MAE, and R². For classification models (LogisticRegression), accuracy, precision, recall, and F1 score are returned instead.\n\nThe method internally calls `predict(X)` and compares against the true `y` values using the metric functions from `linesight.metrics`.\n\n**When to use**: Call `score()` after fitting to get a quantitative assessment of model quality. Use it on training data to check how well the model learned, and on test data to check how well it generalizes. The returned dictionary lets you access individual metrics by key.\n\n**Understanding the metrics**: R² is the most intuitive — it represents the percentage of variance in y that your model explains (1.0 = perfect, 0.0 = no better than predicting the mean). RMSE is in the same units as your target variable, making it directly interpretable. MAE is similar but less sensitive to outliers. MSE is the raw loss function gradient descent minimizes.\n\n**Teaching context**: This method is designed to help students understand that training a model is only half the job — evaluating it is equally important. By returning a dictionary of multiple metrics, students learn that \"model quality\" isn't captured by a single number.",
      "parameters": [
        {
          "name": "X",
          "type": "array-like",
          "default": null,
          "required": true,
          "desc": "Feature matrix for evaluation."
        },
        {
          "name": "y",
          "type": "array-like",
          "default": null,
          "required": true,
          "desc": "True target values to compare predictions against."
        }
      ],
      "returns": {
        "type": "dict",
        "desc": "For regression:\n{\n    \"mse\":        float,   # Mean Squared Error\n    \"rmse\":       float,   # Root Mean Squared Error\n    \"mae\":        float,   # Mean Absolute Error\n    \"r2\":         float,   # R-squared (coefficient of determination)\n    \"n_samples\":  int,     # Number of data points\n    \"n_features\": int      # Number of input features\n}\n\nFor classification (LogisticRegression):\n{\n    \"accuracy\":   float,\n    \"precision\":  float,\n    \"recall\":     float,\n    \"f1\":         float\n}"
      },
      "raises": [
        {
          "exception": "LineSightNotFittedError",
          "condition": "Model has not been fitted",
          "message": "\"Call fit(X, y) before calling score().\""
        }
      ],
      "warns": [],
      "internalSteps": [
        "Check that model is fitted",
        "Validate X and y shapes",
        "Generate predictions via `self.predict(X)`",
        "Compute MSE = mean((y - ŷ)²)",
        "Compute RMSE = √MSE",
        "Compute MAE = mean(|y - ŷ|)",
        "Compute R² = 1 - SS_res / SS_tot",
        "Round all metrics to 6 decimal places",
        "Return dictionary with all metrics"
      ],
      "mathFormula": "MSE  = (1/n) × Σ(yᵢ - ŷᵢ)²\nRMSE = √MSE\nMAE  = (1/n) × Σ|yᵢ - ŷᵢ|\nR²   = 1 - Σ(yᵢ - ŷᵢ)² / Σ(yᵢ - ȳ)²\n\nwhere ȳ = mean(y)",
      "example": "metrics = model.score(X, y)\nprint(metrics)\n# {\n#   'mse': 0.248311,\n#   'rmse': 0.498308,\n#   'mae': 0.398214,\n#   'r2': 0.997012,\n#   'n_samples': 100,\n#   'n_features': 1\n# }\n\n# Access individual metrics\nprint(f\"R² = {metrics['r2']}\")  # 0.997012",
      "inputExample": "# Model already fitted on training data\n# Evaluate on the same data (training score):\n\nmetrics = model.score(X, y)",
      "outputExample": "# Return value: dict\n\nmetrics → {\n    'mse':        0.248311,   # Mean Squared Error\n    'rmse':       0.498308,   # Root Mean Squared Error\n    'mae':        0.398214,   # Mean Absolute Error\n    'r2':         0.997012,   # R² (coefficient of determination)\n    'n_samples':  100,        # number of data points\n    'n_features': 1           # number of input features\n}\n\n# Quick interpretation:\n#   R² = 0.997 → model explains 99.7% of variance\n#   RMSE = 0.498 → predictions off by ±0.5 on average",
      "seeAlso": [
        "fit",
        "predict",
        "explain_fit"
      ]
    },
    "get_training_history": {
      "name": "get_training_history",
      "signature": "model.get_training_history()",
      "category": "core",
      "models": [
        "All Models"
      ],
      "source": "regression/linear/engine/get_history.py",
      "shortDesc": "Return the TrainingHistory object from the last fit() call.",
      "longDesc": "Returns a `TrainingHistory` dataclass containing per-epoch data recorded during the last `fit()` call. This object is essential for visualizations like `plot_loss_curve()` and `animate_training()`.\n\nThe TrainingHistory dataclass has the following fields:\n- `losses`: List of MSE values at each epoch\n- `weights`: List of slope values at each epoch\n- `biases`: List of intercept values at each epoch\n- `gradients`: List of gradient arrays at each epoch\n- `learning_rate`: The learning rate used\n- `epochs_run`: Total epochs completed\n- `converged`: Boolean — whether the model converged\n\nIf `store_history=False` was set during model creation, all lists will be empty and a warning is issued.\n\n**When to use**: Access this when you want to analyze the training process itself — not just the final result. Useful for debugging (\"why didn't my model converge?\"), teaching (\"watch the loss decrease over time\"), and research (\"how did the parameters evolve?\").\n\n**Teaching context**: This object reveals the JOURNEY of gradient descent, not just the destination. Students can see exactly how the slope and intercept changed at each step, which brings the abstract math of gradient descent to life.",
      "parameters": [],
      "returns": {
        "type": "TrainingHistory",
        "desc": "Dataclass with `losses`, `weights`, `biases`, `gradients` lists, plus `learning_rate`, `epochs_run`, and `converged` fields."
      },
      "raises": [
        {
          "exception": "LineSightNotFittedError",
          "condition": "Model has not been fitted",
          "message": "\"Call fit(X, y) before calling get_training_history().\""
        }
      ],
      "warns": [
        {
          "warning": "LineSightDataWarning",
          "condition": "`store_history=False` was used during model creation",
          "message": "\"Training history is empty because store_history=False. Re-fit with store_history=True to access per-epoch data.\""
        }
      ],
      "internalSteps": [
        "Check that model is fitted",
        "Check if history is empty (store_history=False) — warn if so",
        "Return the `_history` TrainingHistory dataclass"
      ],
      "mathFormula": null,
      "example": "model = LinearRegression(\n    learning_rate=0.01,\n    epochs=500,\n    store_history=True   # ← Required!\n)\nmodel.fit(X, y)\n\nhistory = model.get_training_history()\nprint(f\"Final loss: {history.losses[-1]:.6f}\")\nprint(f\"Converged: {history.converged}\")\nprint(f\"Epochs run: {history.epochs_run}\")\n\n# Access per-epoch data\nimport matplotlib.pyplot as plt\nplt.plot(history.losses)\nplt.title(\"Loss over epochs\")\nplt.show()",
      "inputExample": "# Model fitted with store_history=True\nhistory = model.get_training_history()",
      "outputExample": "# Return value: TrainingHistory dataclass\n\nhistory.losses        → [29.604, 18.221, ..., 0.0148]  # 500 values\nhistory.weights       → [0.0, 0.198, ..., 1.9800]      # slope per epoch\nhistory.biases        → [0.0, 0.012, ..., 0.1200]      # intercept per epoch\nhistory.gradients     → [array([-23.4, -8.1]), ...]     # gradient arrays\nhistory.learning_rate → 0.01\nhistory.epochs_run    → 500\nhistory.converged     → True\n\n# Useful for analysis:\nhistory.losses[0]     → 29.604    # initial loss\nhistory.losses[-1]    → 0.0148    # final loss\nlen(history.losses)   → 500       # one per epoch",
      "seeAlso": [
        "fit",
        "plot_loss_curve",
        "animate_training"
      ]
    },
    "summary": {
      "name": "summary",
      "signature": "model.summary()",
      "category": "core",
      "models": [
        "All Models"
      ],
      "source": "regression/linear/core.py",
      "shortDesc": "Print a complete model summary: parameters, fit quality, and coefficients.",
      "longDesc": "Generates a formatted text summary of the model including training configuration, convergence status, and final loss. Each regression subclass overrides this to include model-specific information.\n\nIn script mode (running from a .py file), the summary is printed to stdout. In Jupyter/Colab, it is returned as a string and displayed as the cell's output.\n\nThe summary includes:\n- Model type (e.g., \"LinearRegression\")\n- Learning rate\n- Epochs trained\n- Convergence status\n- Final loss value\n\n**When to use**: Call `summary()` as a quick sanity check after fitting. It gives you a bird's-eye view of the training run in a single call. It's especially useful in Jupyter notebooks where the formatted output appears inline.\n\n**Teaching context**: This method teaches students the habit of inspecting their model after training. Instead of just calling `fit()` and hoping for the best, `summary()` encourages reviewing the hyperparameters, convergence status, and final loss before using the model for predictions.",
      "parameters": [],
      "returns": {
        "type": "str",
        "desc": "The formatted summary text. Also printed to stdout in script mode."
      },
      "raises": [
        {
          "exception": "LineSightNotFittedError",
          "condition": "Model has not been fitted",
          "message": "\"Call fit(X, y) before calling summary().\""
        }
      ],
      "warns": [],
      "internalSteps": [
        "Check that model is fitted",
        "Read convergence status from training history",
        "Read final loss from history (or 'N/A' if history is empty)",
        "Format the summary string with model type, hyperparams, and metrics",
        "Detect environment — print to stdout in script mode",
        "Return the summary string"
      ],
      "mathFormula": null,
      "example": "model.fit(X, y)\nmodel.summary()\n\n# Output:\n# ==================================================\n# LineSight — LinearRegression\n# ==================================================\n# Training config:\n#   Learning rate:  0.01\n#   Epochs:         1000\n#   Converged:      Yes\n#   Final loss:     0.248311\n# ==================================================",
      "inputExample": "# After fitting the model:\nmodel.summary()",
      "outputExample": "# Printed to stdout (script mode) or returned as string (Jupyter):\n\n==================================================\nLineSight — LinearRegression\n==================================================\nTraining config:\n  Learning rate:  0.01\n  Epochs:         1000\n  Converged:      Yes\n  Final loss:     0.248311\n==================================================\n\n# Return value: str (the same text shown above)",
      "seeAlso": [
        "explain_fit",
        "show_equation",
        "score"
      ]
    },
    "refit": {
      "name": "refit",
      "signature": "model.refit(X, y)",
      "category": "core",
      "models": [
        "All Models"
      ],
      "source": "base.py",
      "shortDesc": "Re-train the model from scratch on new data, resetting all state.",
      "longDesc": "Performs a complete reset of the model state (coefficients, intercept, history, fitted flag) and then calls `fit(X, y)` with the new data.\n\nThis method exists because calling `fit()` twice on the same model object does NOT reset the parameters — the second call continues from where the first left off. This produces confusing results for students. `refit()` makes the intention explicit and guarantees a clean start.\n\nIt is equivalent to creating a new instance with the same hyperparameters and calling fit().\n\n**When to use**: Use `refit()` when you want to train on different data while keeping the same model configuration (learning rate, epochs, etc.). Common scenarios include cross-validation, comparing different datasets, or correcting a mistake in the training data.\n\n**Why not just call fit() again?**: In most ML libraries, calling `fit()` twice accumulates state. LineSight makes this explicit: `fit()` continues, `refit()` starts fresh. This prevents a common student mistake where they unknowingly continue training from a previous run.\n\n**Edge cases**: All the same validation errors from `fit()` apply here. The reset happens BEFORE validation, so if the new data is invalid, the model is left in an un-fitted state (`_is_fitted = False`).",
      "parameters": [
        {
          "name": "X",
          "type": "array-like",
          "default": null,
          "required": true,
          "desc": "New feature matrix to train on."
        },
        {
          "name": "y",
          "type": "array-like",
          "default": null,
          "required": true,
          "desc": "New target vector to train on."
        }
      ],
      "returns": {
        "type": "self",
        "desc": "Returns the re-trained model object."
      },
      "raises": [
        {
          "exception": "Same as fit()",
          "condition": "All validation errors from fit() apply here too",
          "message": "See fit() documentation for full error list"
        }
      ],
      "warns": [],
      "internalSteps": [
        "Reset `coef_` to 0.0 (if exists)",
        "Reset `intercept_` to 0.0 (if exists)",
        "Reset `theta_` to None (if exists)",
        "Set `_is_fitted = False`",
        "Create a fresh TrainingHistory object",
        "Call `self.fit(X, y)` with the new data"
      ],
      "mathFormula": null,
      "example": "# Initial training\nmodel.fit(X_train, y_train)\nprint(f\"Slope after first fit: {model.m:.4f}\")\n\n# DON'T do this — continues from previous state:\n# model.fit(X_new, y_new)\n\n# DO this — clean reset + retrain:\nmodel.refit(X_new, y_new)\nprint(f\"Slope after refit: {model.m:.4f}\")",
      "inputExample": "# Original training:\nmodel.fit(X_train, y_train)   # slope → 2.50\n\n# New data arrives:\nX_new = np.array([1, 2, 3, 4, 5]).reshape(-1, 1)\ny_new = np.array([5.1, 7.0, 9.2, 11.0, 12.8])\n\n# Retrain from scratch:\nmodel.refit(X_new, y_new)",
      "outputExample": "# Before refit:\nmodel.m → 2.5000    # slope from old data\nmodel.b → 1.0000    # intercept from old data\n\n# After refit:\nmodel.m → 1.9500    # NEW slope from new data\nmodel.b → 3.1200    # NEW intercept from new data\nmodel._is_fitted → True\n\n# All previous history is replaced:\nlen(history.losses) → 1000  # fresh history",
      "seeAlso": [
        "fit"
      ]
    },
    "show": {
      "name": "show",
      "signature": "model.show(animation_obj=None, fig=None)",
      "category": "core",
      "models": [
        "All Models"
      ],
      "source": "base.py",
      "shortDesc": "Display a figure or animation correctly for the current environment.",
      "longDesc": "Handles the complexity of rendering matplotlib figures and animations across different Python environments (Jupyter, Colab, and script mode).\n\nFor STATIC figures:\n- In Jupyter/Colab: `plt.show()` closes the figure and triggers the inline backend to render it\n- In script mode: `plt.show()` opens an interactive window\n- Returns `None` in both cases (the figure is consumed by the display)\n\nFor ANIMATIONS:\n- In Jupyter/Colab: Returns `HTML(anim.to_jshtml())` for interactive playback\n- In script mode: `plt.show()` runs the animation in a window\n\nYou rarely call this directly — visualization methods like `plot_fit()` call it internally when `display=True`.\n\n**When to use**: Only call `show()` directly when you're building custom matplotlib figures and want LineSight's automatic environment detection. All built-in visualization methods (`plot_fit`, `plot_residuals`, etc.) already use `show()` internally.\n\n**How environment detection works**: LineSight checks for the `IPython` module and its `get_ipython()` function. If a Jupyter kernel is detected, it uses HTML rendering for animations. In Google Colab, a similar path is taken. Otherwise, the standard `plt.show()` windowed display is used.",
      "parameters": [
        {
          "name": "animation_obj",
          "type": "FuncAnimation, optional",
          "default": "None",
          "required": false,
          "desc": "A matplotlib FuncAnimation object to display."
        },
        {
          "name": "fig",
          "type": "matplotlib.figure.Figure, optional",
          "default": "None",
          "required": false,
          "desc": "A matplotlib Figure object to display."
        }
      ],
      "returns": {
        "type": "HTML | None",
        "desc": "Returns `HTML(anim.to_jshtml())` for animations in Jupyter. Returns `None` for everything else."
      },
      "raises": [],
      "warns": [],
      "internalSteps": [
        "Detect environment via `_detect_environment()` → 'jupyter', 'colab', or 'script'",
        "If animation_obj is provided and env is Jupyter/Colab: close figure, return HTML",
        "If animation_obj is provided and env is script: call plt.show()",
        "If fig is provided: call plt.tight_layout() then plt.show()",
        "Return None"
      ],
      "mathFormula": null,
      "example": "# Usually called internally by visualization methods.\n# But you can use it directly:\n\nfig, ax = plt.subplots()\nax.plot([1, 2, 3], [1, 4, 9])\nmodel.show(fig=fig)  # handles env detection\n\n# For animations:\nanim = model.animate_training(X, y, display=False)\nmodel.show(animation_obj=anim)",
      "inputExample": "import matplotlib.pyplot as plt\n\n# Create a custom figure\nfig, ax = plt.subplots(figsize=(8, 5))\nax.scatter(X, y, color='gray')\nax.set_title('My Custom Plot')\n\n# Display using LineSight's environment detection\nmodel.show(fig=fig)",
      "outputExample": "# In Jupyter/Colab:\n#   → Figure renders inline in the notebook cell\n#   → Returns None\n\n# In script mode:\n#   → Interactive matplotlib window opens\n#   → Returns None\n\n# For animations in Jupyter:\n#   → Returns HTML object with play/pause controls\n#   → Interactive animation embedded in cell",
      "seeAlso": [
        "save",
        "plot_fit"
      ]
    }
  },
  "MODELS": {
  "LinearRegression": {
    "conceptTheory": "Linear Regression is a mathematical model used to predict a continuous outcome by fitting a straight line to the data.",
    "learningObjective": "We aim to find the line of best fit by minimizing the Mean Squared Error (MSE) between our predictions and the actual data.",
    "implementationStrategy": "The fit function uses Gradient Descent to iteratively adjust the slope and intercept.",
    "visualDiagram_path": "assets/diagrams/linear_concept.png",
    "outputImage_path": "assets/outputs/linear/plot_fit.png",
    "unique_functions": {
      "animate_loss_surface_path": {
        "name": "animate_loss_surface_path",
        "signature": "model.animate_loss_surface_path(X, y, grid_points: int = 40, skip_frames: int = 10, interval: int = 60, display: bool = True)",
        "category": "visualization",
        "source": "linesight/regression/linear/visualization/animate_loss_surface_path.py",
        "shortDesc": "Animate the gradient descent optimization path on the 3D loss surface.",
        "longDesc": "The surface is computed once (expensive). Then each frame moves the\nred dot along the surface showing the (m, b) values at each epoch.\nRequires store_history=True and single-feature X.\nWhat is drawn\n-------------\nFrame 0: Loss surface rendered, red dot at starting position (m=0, b=0)\nEach frame: red dot moves to next (m, b) from training history\nFinal frame: dot sits at the bottom of the bowl (the optimum)\nTitle updates: \"Epoch {n} — Loss: {loss}\"",
        "parameters": [
          {
            "name": "X",
            "type": "array-like, shape (n, 1)",
            "default": null,
            "required": true,
            "desc": ""
          },
          {
            "name": "y",
            "type": "array-like, shape (n,)",
            "default": null,
            "required": true,
            "desc": ""
          },
          {
            "name": "grid_points",
            "type": "int, default 40",
            "default": "40",
            "required": false,
            "desc": "Surface resolution. Lower than plot_loss_surface default because the surface is rendered once per animation build (slow). Do not exceed 60 — the animation build will take >30 seconds."
          },
          {
            "name": "skip_frames",
            "type": "int, default 10",
            "default": "10",
            "required": false,
            "desc": "Only animate every Nth epoch. 1000 epochs / 10 = 100 frames."
          },
          {
            "name": "interval",
            "type": "int, default 60",
            "default": "60",
            "required": false,
            "desc": "Milliseconds between frames."
          },
          {
            "name": "display",
            "type": "bool, default True",
            "default": "True",
            "required": false,
            "desc": ""
          }
        ],
        "returns": {
          "type": "matplotlib.animation.FuncAnimation",
          "desc": "Output of the animate_loss_surface_path function."
        },
        "raises": [
          {
            "exception": "LineSightShapeError",
            "condition": "",
            "message": "If X has more than 1 feature: \"animate_loss_surface_path() requires single-feature X. Your X has {n} features. The loss surface is 3D only for 1-feature models.\" "
          },
          {
            "exception": "LineSightDataWarning",
            "condition": "(warns, does not raise)",
            "message": "If store_history=False: \"No history available. Re-fit with store_history=True to animate the path.\" "
          },
          {
            "exception": "LineSightDataWarning",
            "condition": "(warns, does not raise)",
            "message": "If grid_points > 60: \"grid_points={n} will make the animation build very slow (>30s). Consider grid_points=40 (default).\" "
          }
        ],
        "warns": [],
        "internalSteps": [
          "Execute animate_loss_surface_path processing",
          "Render or return the output"
        ],
        "mathFormula": null,
        "example": "# 11. Animate the path taken by weights on the loss contour plot\nanim = model.animate_loss_surface_path(X, y, display=False)\nanim.save('loss_surface_path.gif', writer='pillow')",
        "outputImage": "assets/outputs/linear/animate_loss_surface_path.gif"
      },
      "animate_training": {
        "name": "animate_training",
        "signature": "model.animate_training(X, y, interval: int = 50, skip_frames: int = 5, display: bool = True)",
        "category": "visualization",
        "source": "linesight/regression/linear/visualization/animate_training.py",
        "shortDesc": "Animate gradient descent: watch the regression line converge epoch by epoch.",
        "longDesc": "Requires store_history=True during fit().",
        "parameters": [
          {
            "name": "X",
            "type": "array-like, shape (n, 1)",
            "default": null,
            "required": true,
            "desc": ""
          },
          {
            "name": "y",
            "type": "array-like, shape (n,)",
            "default": null,
            "required": true,
            "desc": ""
          },
          {
            "name": "interval",
            "type": "int, default 50   — milliseconds between frames",
            "default": "50",
            "required": false,
            "desc": ""
          },
          {
            "name": "skip_frames",
            "type": "int, default 5    — render every Nth epoch (saves memory)",
            "default": "5",
            "required": false,
            "desc": ""
          },
          {
            "name": "display",
            "type": "bool, default True",
            "default": "True",
            "required": false,
            "desc": ""
          }
        ],
        "returns": {
          "type": "matplotlib.animation.FuncAnimation",
          "desc": "Output of the animate_training function."
        },
        "raises": [],
        "warns": [],
        "internalSteps": [
          "Execute animate_training processing",
          "Render or return the output"
        ],
        "mathFormula": null,
        "example": "# 5. Animate the line of best fit rotating towards the data during epochs\nanim = model.animate_training(X, y, display=False)\nanim.save('training_animation.gif', writer='pillow')",
        "outputImage": "assets/outputs/linear/animate_training.gif"
      },
      "compare_learning_rates": {
        "name": "compare_learning_rates",
        "signature": "model.compare_learning_rates(X, y, learning_rates=None, epochs: int = 200, display: bool = True)",
        "category": "core",
        "source": "linesight/regression/linear/visualization/compare_learning_rates.py",
        "shortDesc": "Train the same model with multiple learning rates and compare loss curves.",
        "longDesc": "What is drawn\n-------------\nOne subplot per learning rate showing the loss curve.\nEach subplot annotated with a diagnosis:\n- \"Converged\" — loss flattened out, model found a good minimum\n- \"Diverged\" — loss went to NaN/inf, learning rate too high\n- \"Still decreasing\" — loss still falling, needs more epochs or higher LR\n- \"Oscillating\" — loss bouncing up and down, LR slightly too high",
        "parameters": [
          {
            "name": "X",
            "type": "array-like",
            "default": null,
            "required": true,
            "desc": ""
          },
          {
            "name": "y",
            "type": "array-like",
            "default": null,
            "required": true,
            "desc": ""
          },
          {
            "name": "learning_rates",
            "type": "list of float, optional",
            "default": null,
            "required": false,
            "desc": "Default: [0.0001, 0.001, 0.01, 0.1]"
          },
          {
            "name": "epochs",
            "type": "int, default 200",
            "default": "200",
            "required": false,
            "desc": "Epochs to train for each learning rate comparison."
          },
          {
            "name": "display",
            "type": "bool, default True",
            "default": "True",
            "required": false,
            "desc": "Side effects Does NOT modify self. Creates temporary model instances internally."
          }
        ],
        "returns": {
          "type": "self",
          "desc": "Output of the compare_learning_rates function."
        },
        "raises": [],
        "warns": [],
        "internalSteps": [
          "Execute compare_learning_rates processing",
          "Render or return the output"
        ],
        "mathFormula": null,
        "example": "# 14. Compare convergence rates for multiple learning rates\nfig = model.compare_learning_rates(X, y, lrs=[0.001, 0.01, 0.1], display=False)\nfig.savefig('compare_lrs.png')",
        "outputImage": null
      },
      "explain_coefficients": {
        "name": "explain_coefficients",
        "signature": "model.explain_coefficients() -> str",
        "category": "explain",
        "source": "linesight/regression/linear/explain/explain_coefficients.py",
        "shortDesc": "Print a plain-English explanation of each learned coefficient.",
        "longDesc": "Output example:\n---------------\nSlope (coef_): 3.42\nFor every 1-unit increase in the input,\nthe predicted output increases by 3.42.\nIntercept: 1.20\nWhen the input is 0, the model predicts 1.20.",
        "parameters": [],
        "returns": {
          "type": "str",
          "desc": "Output of the explain_coefficients function."
        },
        "raises": [],
        "warns": [],
        "internalSteps": [
          "Execute explain_coefficients processing",
          "Render or return the output"
        ],
        "mathFormula": null,
        "example": "# 3. Retrieve and explain the weight (slope) and bias (intercept)\nexplanation = model.explain_coefficients()\nprint(explanation)",
        "outputImage": null
      },
      "explain_fit": {
        "name": "explain_fit",
        "signature": "model.explain_fit(X, y) -> str",
        "category": "explain",
        "source": "linesight/regression/linear/explain/explain_fit.py",
        "shortDesc": "Print a readable summary of model fit quality.",
        "longDesc": "Interprets each metric in plain English so the reader understands\nwhat the numbers mean, not just what they are.\nOutput example:\n---------------\nModel fit summary\n-----------------\nR^2   = 0.9980\nThe model explains 99.8% of the variance in y.\n(1.0 = perfect fit, 0.0 = no better than predicting the mean)\nRMSE = 0.3500\nOn average, predictions are off by +/-0.35 in the same units as y.\nMAE  = 0.2800\nThe average absolute prediction error is 0.28 units.\nMSE  = 0.1225\n(RMSE^2 — useful for gradient-based optimization)",
        "parameters": [
          {
            "name": "X",
            "type": "array-like",
            "default": null,
            "required": true,
            "desc": "Input parameter `X`."
          },
          {
            "name": "y",
            "type": "array-like",
            "default": null,
            "required": true,
            "desc": "Input parameter `y`."
          }
        ],
        "returns": {
          "type": "str",
          "desc": "Output of the explain_fit function."
        },
        "raises": [],
        "warns": [],
        "internalSteps": [
          "Execute explain_fit processing",
          "Render or return the output"
        ],
        "mathFormula": null,
        "example": "# 4. Generate step-by-step mathematical explanation of the fitting process\nmodel.explain_fit(X, y)",
        "outputImage": null
      },
      "fit": {
        "name": "fit",
        "signature": "model.fit(X, y)",
        "category": "core",
        "source": "linesight/regression/linear/engine/fit.py",
        "shortDesc": "Train simple linear regression with gradient descent (m*x + b).",
        "longDesc": "Train simple linear regression with gradient descent (m*x + b).",
        "parameters": [
          {
            "name": "X",
            "type": "array-like",
            "default": null,
            "required": true,
            "desc": "Input parameter `X`."
          },
          {
            "name": "y",
            "type": "array-like",
            "default": null,
            "required": true,
            "desc": "Input parameter `y`."
          }
        ],
        "returns": {
          "type": "self",
          "desc": "Output of the fit function."
        },
        "raises": [],
        "warns": [],
        "internalSteps": [
          "Execute fit processing",
          "Render or return the output"
        ],
        "mathFormula": "Loss J(w, b) = (1/n) * sum((y_pred_i - y_i)^2)\nUpdate: w := w - lr * dJ/dw,  b := b - lr * dJ/db",
        "example": "import numpy as np\nfrom linesight import LinearRegression\n\n# Generate training data\nX = np.array([[1], [2], [3], [4], [5]])\ny = np.array([2.1, 4.0, 5.8, 8.1, 9.9])\n\n# 1. Initialize and fit the model using Gradient Descent\nmodel = LinearRegression(learning_rate=0.01, store_history=True)\nmodel.fit(X, y)",
        "outputImage": null
      },
      "plot_actual_vs_predicted": {
        "name": "plot_actual_vs_predicted",
        "signature": "model.plot_actual_vs_predicted(X, y, display: bool = True)",
        "category": "visualization",
        "source": "linesight/regression/linear/visualization/plot_actual_vs_predicted.py",
        "shortDesc": "Scatter plot of actual y values vs predicted ŷ values.",
        "longDesc": "What is drawn\n-------------\n- X-axis: actual y values\n- Y-axis: predicted ŷ values\n- Diagonal line y=x (the \"perfect prediction\" line)\n- Each point is one sample\n- Points above the diagonal = model overestimated\n- Points below the diagonal = model underestimated\n- R² shown in corner\nWhy this matters\n----------------\nThis works for ALL regression types regardless of number of features,\nbecause both axes are scalar (y and ŷ). It is the universal fit diagnostic.\nplot_fit() only works for 1-feature models. This one always works.\nA tight cloud around the diagonal = good fit.\nA curved cloud = the relationship is non-linear (try polynomial).\nFunnel shape = heteroscedasticity.",
        "parameters": [
          {
            "name": "X",
            "type": "array-like",
            "default": null,
            "required": true,
            "desc": "Input parameter `X`."
          },
          {
            "name": "y",
            "type": "array-like",
            "default": null,
            "required": true,
            "desc": "Input parameter `y`."
          },
          {
            "name": "display",
            "type": "bool",
            "default": "True",
            "required": false,
            "desc": "Input parameter `display`."
          }
        ],
        "returns": {
          "type": "matplotlib.figure.Figure",
          "desc": "Output of the plot_actual_vs_predicted function."
        },
        "raises": [],
        "warns": [],
        "internalSteps": [
          "Execute plot_actual_vs_predicted processing",
          "Render or return the output"
        ],
        "mathFormula": null,
        "example": "# Instantiate and train model\nmodel = LinearRegression()\nmodel.fit(X, y)\n\n# Call method\nmodel.plot_actual_vs_predicted(X, y)",
        "outputImage": "assets/outputs/linear/plot_actual_vs_predicted.png"
      },
      "plot_fit": {
        "name": "plot_fit",
        "signature": "model.plot_fit(X, y, show_residuals: bool = True, display: bool = True)",
        "category": "visualization",
        "source": "linesight/regression/linear/visualization/plot_fit.py",
        "shortDesc": "Plot the data, the fitted regression line, and optional residual bars.",
        "longDesc": "What is drawn\n-------------\n1. Scatter plot of raw data points (gray, edged in white)\n2. Regression line (blue) from min(X) to max(X)\n3. If show_residuals=True:\n- Vertical dashed lines from each point to the line\n- Red dashes = point is above the line (positive residual)\n- Blue dashes = point is below the line (negative residual)\nThis teaches the student VISUALLY what residuals are.",
        "parameters": [
          {
            "name": "X",
            "type": "array-like, shape (n,) or (n, 1) — single feature only",
            "default": null,
            "required": true,
            "desc": ""
          },
          {
            "name": "y",
            "type": "array-like, shape (n,)",
            "default": null,
            "required": true,
            "desc": ""
          },
          {
            "name": "show_residuals",
            "type": "bool, default True",
            "default": "True",
            "required": false,
            "desc": ""
          },
          {
            "name": "display",
            "type": "bool, default True",
            "default": "True",
            "required": false,
            "desc": "If True, calls self.show(fig=fig) which handles Jupyter/script routing. If False, returns the figure without displaying."
          }
        ],
        "returns": {
          "type": "matplotlib.figure.Figure",
          "desc": "Output of the plot_fit function."
        },
        "raises": [
          {
            "exception": "LineSightShapeError",
            "condition": "if X has more than 1 feature. Use",
            "message": ""
          },
          {
            "exception": "MultipleLinearRegression.plot_partial_regression()",
            "condition": "for multi-feature models.",
            "message": ""
          }
        ],
        "warns": [],
        "internalSteps": [
          "Execute plot_fit processing",
          "Render or return the output"
        ],
        "mathFormula": null,
        "example": "# 6. Plot the static line of best fit over the training points\nfig = model.plot_fit(X, y, display=False)\nfig.savefig('fit_line.png')",
        "outputImage": "assets/outputs/linear/plot_fit.png"
      },
      "plot_gradient_vectors": {
        "name": "plot_gradient_vectors",
        "signature": "model.plot_gradient_vectors(X, y, scale: float = 0.3, display: bool = True)",
        "category": "visualization",
        "source": "linesight/regression/linear/visualization/plot_gradient_vectors.py",
        "shortDesc": "Visualize the gradient contribution of each data point as an arrow.",
        "longDesc": "Each point contributes to the gradient update:\ncontribution_i = (y_pred_i - y_i) * x_i   (for slope gradient)\nA point ABOVE the line (positive residual) pulls the line UP.\nA point BELOW the line (negative residual) pulls the line DOWN.\nThe arrow length = magnitude of that point's gradient contribution.\nWhat is drawn\n-------------\n1. Scatter of data points, colored red (above line) or blue (below line)\n2. Regression line\n3. Vertical arrows from each point toward the line, scaled by residual\n- Arrow length = abs(residual) * scale\n- Arrow direction = toward the line (up if point is below, down if above)\n4. Net gradient annotation: \"Net gradient pull: slope ↑ / ↓\"",
        "parameters": [
          {
            "name": "X",
            "type": "array-like, shape (n,) or (n, 1)",
            "default": null,
            "required": true,
            "desc": ""
          },
          {
            "name": "y",
            "type": "array-like, shape (n,)",
            "default": null,
            "required": true,
            "desc": ""
          },
          {
            "name": "scale",
            "type": "float, default 0.3",
            "default": "0.3",
            "required": false,
            "desc": "Multiplier for arrow length. Increase if arrows are too small. Decrease if arrows overlap badly."
          },
          {
            "name": "display",
            "type": "bool, default True",
            "default": "True",
            "required": false,
            "desc": ""
          }
        ],
        "returns": {
          "type": "matplotlib.figure.Figure",
          "desc": "Output of the plot_gradient_vectors function."
        },
        "raises": [
          {
            "exception": "LineSightShapeError",
            "condition": "",
            "message": "If X has more than 1 feature. Gradient vectors require 2D space. Message: \"plot_gradient_vectors() requires exactly 1 feature. Your X has {n} features. Gradient arrows live in 2D (x, y) space and cannot be drawn for high-dimensional inputs.\" "
          }
        ],
        "warns": [
          {
            "warning": "LineSightDataWarning",
            "condition": "if n_samples > 200:",
            "message": "\"plot_gradient_vectors() on {n} points may be cluttered. Consider passing a subset: X[:50], y[:50]\" "
          }
        ],
        "internalSteps": [
          "Execute plot_gradient_vectors processing",
          "Render or return the output"
        ],
        "mathFormula": null,
        "example": "# 10. Overlay the gradient vector field showing optimization direction\nfig = model.plot_gradient_vectors(X, y, display=False)\nfig.savefig('gradient_vectors.png')",
        "outputImage": "assets/outputs/linear/plot_gradient_vectors.png"
      },
      "plot_learning_curve": {
        "name": "plot_learning_curve",
        "signature": "model.plot_learning_curve(X, y, cv_splits: int = 5, train_sizes=None, display: bool = True)",
        "category": "visualization",
        "source": "linesight/regression/linear/visualization/plot_learning_curve.py",
        "shortDesc": "Show how model performance changes as training dataset size grows.",
        "longDesc": "What is drawn\n-------------\n- X-axis: number of training samples used\n- Y-axis: R² score (or accuracy for logistic)\n- Blue line: training score at each dataset size\n- Red line: validation score at each dataset size\nWhat this teaches\n-----------------\n- If training score is high but validation score is low at ALL sizes:\nthe model is overfitting regardless of data size\n- If both scores are low and flat: the model is underfitting — more\ndata won't help, the model type is wrong\n- If validation score is rising and approaching training score as n grows:\ngetting more data WILL help\nAlgorithm\n---------\nFor each train_size in train_sizes:\n1. Take first train_size samples as training set\n2. Use the remaining as validation set\n3. Fit a temporary model on training set\n4. Score on both sets\n5. Repeat cv_splits times with different random subsets, take mean",
        "parameters": [
          {
            "name": "X",
            "type": "array-like",
            "default": null,
            "required": true,
            "desc": ""
          },
          {
            "name": "y",
            "type": "array-like",
            "default": null,
            "required": true,
            "desc": ""
          },
          {
            "name": "cv_splits",
            "type": "int, default 5",
            "default": "5",
            "required": false,
            "desc": "Number of random subsets to average for each train size. Higher = smoother curve but slower."
          },
          {
            "name": "train_sizes",
            "type": "list of int, optional",
            "default": null,
            "required": false,
            "desc": "Default: 10 evenly-spaced sizes from 10% to 90% of dataset."
          },
          {
            "name": "display",
            "type": "bool, default True",
            "default": "True",
            "required": false,
            "desc": ""
          }
        ],
        "returns": {
          "type": "matplotlib.figure.Figure",
          "desc": "Output of the plot_learning_curve function."
        },
        "raises": [],
        "warns": [],
        "internalSteps": [
          "Execute plot_learning_curve processing",
          "Render or return the output"
        ],
        "mathFormula": null,
        "example": "# Instantiate and train model\nmodel = LinearRegression()\nmodel.fit(X, y)\n\n# Call method\nmodel.plot_learning_curve(X, y)",
        "outputImage": "assets/outputs/linear/plot_learning_curve.png"
      },
      "plot_loss_curve": {
        "name": "plot_loss_curve",
        "signature": "model.plot_loss_curve(display: bool = True)",
        "category": "visualization",
        "source": "linesight/regression/linear/visualization/plot_loss_curve.py",
        "shortDesc": "Plot the training loss over epochs.",
        "longDesc": "Requires store_history=True during fit().\nWhat is drawn\n-------------\n- X-axis: epoch number\n- Y-axis: MSE loss\n- Final loss value annotated on the last point\n- The curve shape teaches: fast initial drop, then slow convergence",
        "parameters": [
          {
            "name": "display",
            "type": "bool, default True",
            "default": "True",
            "required": false,
            "desc": ""
          }
        ],
        "returns": {
          "type": "matplotlib.figure.Figure",
          "desc": "Output of the plot_loss_curve function."
        },
        "raises": [],
        "warns": [
          {
            "warning": "LineSightDataWarning",
            "condition": "if store_history=False",
            "message": ""
          }
        ],
        "internalSteps": [
          "Execute plot_loss_curve processing",
          "Render or return the output"
        ],
        "mathFormula": null,
        "example": "# 8. Plot Mean Squared Error (MSE) curve decreasing over epochs\nfig = model.plot_loss_curve(display=False)\nfig.savefig('loss_curve.png')",
        "outputImage": "assets/outputs/linear/plot_loss_curve.png"
      },
      "plot_loss_surface": {
        "name": "plot_loss_surface",
        "signature": "model.plot_loss_surface(X, y, m_range=None, b_range=None, grid_points: int = 50, display: bool = True)",
        "category": "visualization",
        "source": "linesight/regression/linear/visualization/plot_loss_surface.py",
        "shortDesc": "Plot the 3D loss surface over the (slope, intercept) parameter space.",
        "longDesc": "What is drawn\n-------------\n- 3D surface where Z = MSE loss at each (m, b) combination\n- The bowl shape shows WHY gradient descent works — loss decreases in all\ndirections toward the minimum\n- Red dot marks the model's fitted (m, b) on the surface\n- If store_history=True, the optimization path is drawn on the surface",
        "parameters": [
          {
            "name": "X",
            "type": "array-like, shape (n, 1)",
            "default": null,
            "required": true,
            "desc": ""
          },
          {
            "name": "y",
            "type": "array-like, shape (n,)",
            "default": null,
            "required": true,
            "desc": ""
          },
          {
            "name": "m_range",
            "type": "tuple (min, max), optional",
            "default": null,
            "required": false,
            "desc": "Range of slope values to plot. Default: fitted m +/- 3 * abs(fitted m)"
          },
          {
            "name": "b_range",
            "type": "tuple (min, max), optional",
            "default": null,
            "required": false,
            "desc": "Range of intercept values. Default: fitted b +/- 3 * abs(fitted b) + 1"
          },
          {
            "name": "grid_points",
            "type": "int, default 50",
            "default": "50",
            "required": false,
            "desc": "Resolution of the surface grid. Higher = smoother but slower."
          },
          {
            "name": "display",
            "type": "bool, default True",
            "default": "True",
            "required": false,
            "desc": "Performance warning Computes loss for grid_points^2 parameter combinations. With grid_points=50 and n=10000 samples, this is 25M multiplications. A warning is issued for n > 5000. Only works for single-feature models."
          }
        ],
        "returns": {
          "type": "matplotlib.figure.Figure",
          "desc": "Output of the plot_loss_surface function."
        },
        "raises": [],
        "warns": [],
        "internalSteps": [
          "Execute plot_loss_surface processing",
          "Render or return the output"
        ],
        "mathFormula": null,
        "example": "# 9. Plot the 3D error surface J(w, b) and contour lines\nfig = model.plot_loss_surface(X, y, display=False)\nfig.savefig('loss_surface.png')",
        "outputImage": "assets/outputs/linear/plot_loss_surface.png"
      },
      "plot_prediction_intervals": {
        "name": "plot_prediction_intervals",
        "signature": "model.plot_prediction_intervals(X, y, confidence: float = 0.95, display: bool = True)",
        "category": "visualization",
        "source": "linesight/regression/linear/visualization/plot_prediction_intervals.py",
        "shortDesc": "Plot the regression line with confidence and prediction interval bands.",
        "longDesc": "Two interval types are shown:\n---------------------------------------------------------------\nConfidence interval (inner, darker band):\nUncertainty about WHERE THE MEAN LINE IS.\nFormula: ŷ ± t * SE_mean\nSE_mean = s * sqrt(1/n + (x - x̄)² / Σ(xᵢ - x̄)²)\nNarrowest at x=x̄ (the mean of X), widens toward extremes.\nPrediction interval (outer, lighter band):\nUncertainty about WHERE A NEW INDIVIDUAL POINT WILL FALL.\nFormula: ŷ ± t * SE_pred\nSE_pred = s * sqrt(1 + 1/n + (x - x̄)² / Σ(xᵢ - x̄)²)\nAlways wider than confidence interval by the extra \"1 +\" term.\nThis extra term accounts for individual random variation.\nWhere:\ns = residual standard error = sqrt(MSE * n / (n-2))\nt = t-distribution critical value for (n-2) degrees of freedom\nn = number of training samples\nx̄ = mean of training X\nThe t-distribution is used instead of z=1.96 for finite samples.\nFor n > 30 they are nearly identical. For n < 30 the difference matters.",
        "parameters": [
          {
            "name": "X",
            "type": "array-like, shape (n,) or (n, 1)",
            "default": null,
            "required": true,
            "desc": ""
          },
          {
            "name": "y",
            "type": "array-like, shape (n,)",
            "default": null,
            "required": true,
            "desc": ""
          },
          {
            "name": "confidence",
            "type": "float, default 0.95",
            "default": "0.95",
            "required": false,
            "desc": "Confidence level. 0.95 = 95% confidence intervals. Must be between 0.5 and 0.999."
          },
          {
            "name": "display",
            "type": "bool, default True",
            "default": "True",
            "required": false,
            "desc": ""
          }
        ],
        "returns": {
          "type": "matplotlib.figure.Figure",
          "desc": "Output of the plot_prediction_intervals function."
        },
        "raises": [
          {
            "exception": "LineSightShapeError",
            "condition": "",
            "message": "If X has more than 1 feature. Message: \"plot_prediction_intervals() only works for single-feature models. Your X has {n} features. For multi-feature models, use plot_actual_vs_predicted() to assess fit quality.\" "
          },
          {
            "exception": "LineSightShapeError",
            "condition": "",
            "message": "If confidence is outside [0.5, 0.999]. Message: \"confidence must be between 0.5 and 0.999. Received: {confidence} Common values: 0.90 (90%), 0.95 (95%), 0.99 (99%).\" "
          }
        ],
        "warns": [
          {
            "warning": "LineSightDataWarning",
            "condition": "if n < 10:",
            "message": "\"Only {n} samples. Prediction intervals will be very wide and unreliable. Intervals require at least 20-30 samples to be meaningful.\" "
          }
        ],
        "internalSteps": [
          "Execute plot_prediction_intervals processing",
          "Render or return the output"
        ],
        "mathFormula": null,
        "example": "# 12. Display prediction and confidence intervals around the fit line\nfig = model.plot_prediction_intervals(X, y, display=False)\nfig.savefig('prediction_intervals.png')",
        "outputImage": "assets/outputs/linear/plot_prediction_intervals.png"
      },
      "plot_residuals": {
        "name": "plot_residuals",
        "signature": "model.plot_residuals(X, y, display: bool = True)",
        "category": "visualization",
        "source": "linesight/regression/linear/visualization/plot_residuals.py",
        "shortDesc": "Plot residuals (actual - predicted) against fitted values.",
        "longDesc": "What is drawn\n-------------\n- X-axis: fitted values (y_hat)\n- Y-axis: residuals (y - y_hat)\n- Horizontal dashed line at y=0 (where a perfect model would sit)\n- Points colored red (positive residual = underprediction)\nand blue (negative residual = overprediction)\nWhat to look for\n----------------\n- Random scatter around zero = good fit, assumptions met\n- Curved pattern = linear model is wrong, try polynomial\n- Funnel shape = heteroscedasticity (variance increases with fitted value)\n- Outliers far from zero = influential data points",
        "parameters": [
          {
            "name": "X",
            "type": "array-like",
            "default": null,
            "required": true,
            "desc": ""
          },
          {
            "name": "y",
            "type": "array-like",
            "default": null,
            "required": true,
            "desc": ""
          },
          {
            "name": "display",
            "type": "bool, default True",
            "default": "True",
            "required": false,
            "desc": ""
          }
        ],
        "returns": {
          "type": "matplotlib.figure.Figure",
          "desc": "Output of the plot_residuals function."
        },
        "raises": [],
        "warns": [],
        "internalSteps": [
          "Execute plot_residuals processing",
          "Render or return the output"
        ],
        "mathFormula": null,
        "example": "# 7. Check residual errors to verify homoscedasticity assumption\nfig = model.plot_residuals(X, y, display=False)\nfig.savefig('residuals.png')",
        "outputImage": "assets/outputs/linear/plot_residuals.png"
      },
      "plot_sensitivity_analysis": {
        "name": "plot_sensitivity_analysis",
        "signature": "model.plot_sensitivity_analysis(X, y, top_n: int = 3, display: bool = True)",
        "category": "visualization",
        "source": "linesight/regression/linear/visualization/plot_sensitivity_analysis.py",
        "shortDesc": "Show how the regression line changes when each point is removed.",
        "longDesc": "For each data point i, compute:\n1. Fit a temporary model on all points EXCEPT i\n2. Record the new slope and intercept\n3. Plot this \"leave-one-out\" line in light gray\n4. Highlight the top_n most influential points (those that, when removed,\nchange the slope the most) in red\nWhat is drawn\n-------------\nLeft subplot: scatter + regression lines\n- All \"leave-one-out\" lines overlaid in light gray (alpha=0.15)\n- The original fitted line in blue\n- Top_n most influential points highlighted with red circles and labeled\n- A \"stability band\": if all gray lines stay close to the blue, the model\nis stable. If some gray lines deviate far, there are influential points.\nRight subplot: influence score bar chart\n- X-axis: sample index\n- Y-axis: abs(slope_change) when that point is removed\n- Top_n bars colored red",
        "parameters": [
          {
            "name": "X",
            "type": "array-like, shape (n, 1)",
            "default": null,
            "required": true,
            "desc": ""
          },
          {
            "name": "y",
            "type": "array-like, shape (n,)",
            "default": null,
            "required": true,
            "desc": ""
          },
          {
            "name": "top_n",
            "type": "int, default 3",
            "default": "3",
            "required": false,
            "desc": "Number of most influential points to highlight."
          },
          {
            "name": "display",
            "type": "bool, default True",
            "default": "True",
            "required": false,
            "desc": ""
          }
        ],
        "returns": {
          "type": "matplotlib.figure.Figure",
          "desc": "Output of the plot_sensitivity_analysis function."
        },
        "raises": [
          {
            "exception": "LineSightShapeError",
            "condition": "",
            "message": "If X has more than 1 feature: \"plot_sensitivity_analysis() requires single-feature X. Your X has {n} features. Leave-one-out lines require 2D visualization.\" "
          },
          {
            "exception": "LineSightShapeError",
            "condition": "",
            "message": "If n < 5: \"plot_sensitivity_analysis() requires at least 5 samples. Your dataset has only {n} samples. Leave-one-out fitting is unreliable with very small datasets.\" "
          }
        ],
        "warns": [
          {
            "warning": "LineSightDataWarning",
            "condition": "if n > 500:",
            "message": "\"Fitting {n} leave-one-out models may be slow. Consider passing a subset: X[:100], y[:100]\" "
          }
        ],
        "internalSteps": [
          "Execute plot_sensitivity_analysis processing",
          "Render or return the output"
        ],
        "mathFormula": null,
        "example": "# 13. Perform sensitivity analysis of predictions to feature perturbation\nfig = model.plot_sensitivity_analysis(X, y, display=False)\nfig.savefig('sensitivity_analysis.png')",
        "outputImage": "assets/outputs/linear/plot_sensitivity_analysis.png"
      },
      "show_equation": {
        "name": "show_equation",
        "signature": "model.show_equation() -> str",
        "category": "explain",
        "source": "linesight/regression/linear/explain/show_equation.py",
        "shortDesc": "Print and return the learned regression equation as a human-readable string.",
        "longDesc": "Output format:  y = 3.4200x + 1.2000\nNegative intercept:  y = 3.4200x - 0.8000",
        "parameters": [],
        "returns": {
          "type": "str",
          "desc": "Output of the show_equation function."
        },
        "raises": [],
        "warns": [],
        "internalSteps": [
          "Execute show_equation processing",
          "Render or return the output"
        ],
        "mathFormula": null,
        "example": "# 2. Extract and display the fitted regression line equation\nequation = model.show_equation()\nprint(equation)  # Output: 'y = 1.9600x + 0.1200'",
        "outputImage": null
      }
    }
  },
  "MultipleLinearRegression": {
    "conceptTheory": "Multiple Linear Regression extends linear regression to model relationships between a dependent variable and multiple independent variables.",
    "learningObjective": "Find the optimal weight vector w and bias b that minimize MSE across multiple input dimensions.",
    "implementationStrategy": "Gradient Descent is applied to update weights for all features simultaneously, with support for feature scaling.",
    "visualDiagram_path": "assets/diagrams/multiple_concept.png",
    "outputImage_path": "assets/outputs/multiple/plot_fit.png",
    "unique_functions": {
      "explain_coefficients": {
        "name": "explain_coefficients",
        "signature": "model.explain_coefficients() -> str",
        "category": "explain",
        "source": "linesight/regression/multiple/explain/explain_coefficients.py",
        "shortDesc": "Print plain-English explanation of each learned coefficient.",
        "longDesc": "Print plain-English explanation of each learned coefficient.",
        "parameters": [],
        "returns": {
          "type": "str",
          "desc": "Output of the explain_coefficients function."
        },
        "raises": [],
        "warns": [],
        "internalSteps": [
          "Execute explain_coefficients processing",
          "Render or return the output"
        ],
        "mathFormula": null,
        "example": "# Instantiate and train model\nmodel = MultipleLinearRegression()\nmodel.fit(X, y)\n\n# Call method\nmodel.explain_coefficients()",
        "outputImage": null
      },
      "fit": {
        "name": "fit",
        "signature": "model.fit(X, y)",
        "category": "core",
        "source": "linesight/regression/multiple/engine/fit.py",
        "shortDesc": "Train multiple linear regression: y_pred = dot(X, weights) + bias.",
        "longDesc": "If normalize=True (default False), standardizes each feature to\nmean=0 / std=1 before training. Prevents gradient explosion on\nmixed-scale features. Predictions are automatically un-scaled.",
        "parameters": [
          {
            "name": "X",
            "type": "array-like",
            "default": null,
            "required": true,
            "desc": "Input parameter `X`."
          },
          {
            "name": "y",
            "type": "array-like",
            "default": null,
            "required": true,
            "desc": "Input parameter `y`."
          }
        ],
        "returns": {
          "type": "self",
          "desc": "Output of the fit function."
        },
        "raises": [],
        "warns": [],
        "internalSteps": [
          "Execute fit processing",
          "Render or return the output"
        ],
        "mathFormula": "Loss J(w, b) = (1/n) * sum((y_pred_i - y_i)^2)\nUpdate: w := w - lr * dJ/dw,  b := b - lr * dJ/db",
        "example": "import numpy as np\nfrom linesight import MultipleLinearRegression\n\n# Generate synthetic 2-feature training data\nX = np.random.randn(50, 2)\ny = 1.5 * X[:, 0] - 2.0 * X[:, 1] + 1.0 + np.random.randn(50) * 0.5\n\n# 1. Initialize and fit the Multiple Linear Regression model\nmodel = MultipleLinearRegression(learning_rate=0.01, normalize=True)\nmodel.fit(X, y)",
        "outputImage": null
      },
      "plot_3d_loss_slice": {
        "name": "plot_3d_loss_slice",
        "signature": "model.plot_3d_loss_slice(X, y, theta_i: int = 0, theta_j: int = 1, grid_points: int = 40, display: bool = True)",
        "category": "visualization",
        "source": "linesight/regression/multiple/visualization/plot_3d_loss_slice.py",
        "shortDesc": "Show a 2D slice of the loss surface by varying two parameters.",
        "longDesc": "Holds all theta values at their fitted values EXCEPT theta_i and theta_j,\nwhich are varied over a grid. Computes loss at each (theta_i, theta_j)\ncombination and renders as a 3D surface.\nThis is the correct approach for multi-feature models where the full\nloss surface exists in p+1 dimensions and cannot be visualized directly.",
        "parameters": [
          {
            "name": "X",
            "type": "array-like, shape (n, p)",
            "default": null,
            "required": true,
            "desc": ""
          },
          {
            "name": "y",
            "type": "array-like, shape (n,)",
            "default": null,
            "required": true,
            "desc": ""
          },
          {
            "name": "theta_i",
            "type": "int, default 0",
            "default": "0",
            "required": false,
            "desc": "Index of first parameter to vary (0 = intercept, 1 = first feature, etc.)"
          },
          {
            "name": "theta_j",
            "type": "int, default 1",
            "default": "1",
            "required": false,
            "desc": "Index of second parameter to vary."
          },
          {
            "name": "grid_points",
            "type": "int, default 40",
            "default": "40",
            "required": false,
            "desc": "Resolution of the surface grid."
          },
          {
            "name": "display",
            "type": "bool, default True",
            "default": "True",
            "required": false,
            "desc": ""
          }
        ],
        "returns": {
          "type": "matplotlib.figure.Figure",
          "desc": "Output of the plot_3d_loss_slice function."
        },
        "raises": [
          {
            "exception": "LineSightShapeError",
            "condition": "",
            "message": "If theta_i == theta_j: \"theta_i and theta_j must be different indices. Received theta_i={i}, theta_j={j}. To slice the loss surface you need two DIFFERENT parameters to vary.\" "
          },
          {
            "exception": "LineSightShapeError",
            "condition": "",
            "message": "If theta_i or theta_j is out of range: \"theta_i={i} is out of range. Your model has {p} features, so valid theta indices are 0 (intercept) through {p} (last feature).\" "
          }
        ],
        "warns": [],
        "internalSteps": [
          "Execute plot_3d_loss_slice processing",
          "Render or return the output"
        ],
        "mathFormula": null,
        "example": "# Instantiate and train model\nmodel = MultipleLinearRegression()\nmodel.fit(X, y)\n\n# Call method\nmodel.plot_3d_loss_slice(X, y)",
        "outputImage": "assets/outputs/multiple/plot_3d_loss_slice.png"
      },
      "plot_actual_vs_predicted": {
        "name": "plot_actual_vs_predicted",
        "signature": "model.plot_actual_vs_predicted(X, y, display: bool = True)",
        "category": "visualization",
        "source": "linesight/regression/multiple/visualization/plot_actual_vs_predicted.py",
        "shortDesc": "Scatter plot of actual y values vs predicted ŷ values.",
        "longDesc": "What is drawn\n-------------\n- X-axis: actual y values\n- Y-axis: predicted ŷ values\n- Diagonal line y=x (the \"perfect prediction\" line)\n- Each point is one sample\n- Points above the diagonal = model overestimated\n- Points below the diagonal = model underestimated\n- R² shown in corner\nWhy this matters\n----------------\nThis works for ALL regression types regardless of number of features,\nbecause both axes are scalar (y and ŷ). It is the universal fit diagnostic.\nplot_fit() only works for 1-feature models. This one always works.\nA tight cloud around the diagonal = good fit.\nA curved cloud = the relationship is non-linear (try polynomial).\nFunnel shape = heteroscedasticity.",
        "parameters": [
          {
            "name": "X",
            "type": "array-like",
            "default": null,
            "required": true,
            "desc": "Input parameter `X`."
          },
          {
            "name": "y",
            "type": "array-like",
            "default": null,
            "required": true,
            "desc": "Input parameter `y`."
          },
          {
            "name": "display",
            "type": "bool",
            "default": "True",
            "required": false,
            "desc": "Input parameter `display`."
          }
        ],
        "returns": {
          "type": "matplotlib.figure.Figure",
          "desc": "Output of the plot_actual_vs_predicted function."
        },
        "raises": [],
        "warns": [],
        "internalSteps": [
          "Execute plot_actual_vs_predicted processing",
          "Render or return the output"
        ],
        "mathFormula": null,
        "example": "# Instantiate and train model\nmodel = MultipleLinearRegression()\nmodel.fit(X, y)\n\n# Call method\nmodel.plot_actual_vs_predicted(X, y)",
        "outputImage": "assets/outputs/multiple/plot_actual_vs_predicted.png"
      },
      "plot_correlation_matrix": {
        "name": "plot_correlation_matrix",
        "signature": "model.plot_correlation_matrix(X, y, display: bool = True)",
        "category": "visualization",
        "source": "linesight/regression/multiple/visualization/plot_correlation_matrix.py",
        "shortDesc": "Heatmap of the correlation matrix for all features + target.",
        "longDesc": "Heatmap of the correlation matrix for all features + target.",
        "parameters": [
          {
            "name": "X",
            "type": "array-like",
            "default": null,
            "required": true,
            "desc": "Input parameter `X`."
          },
          {
            "name": "y",
            "type": "array-like",
            "default": null,
            "required": true,
            "desc": "Input parameter `y`."
          },
          {
            "name": "display",
            "type": "bool",
            "default": "True",
            "required": false,
            "desc": "Input parameter `display`."
          }
        ],
        "returns": {
          "type": "matplotlib.figure.Figure",
          "desc": "Output of the plot_correlation_matrix function."
        },
        "raises": [],
        "warns": [],
        "internalSteps": [
          "Execute plot_correlation_matrix processing",
          "Render or return the output"
        ],
        "mathFormula": null,
        "example": "# 6. Plot the correlation matrix heatmap of the features\nfig = model.plot_correlation_matrix(X, display=False)\nfig.savefig('correlation_matrix.png')",
        "outputImage": "assets/outputs/multiple/plot_correlation_matrix.png"
      },
      "plot_feature_importance": {
        "name": "plot_feature_importance",
        "signature": "model.plot_feature_importance(display: bool = True)",
        "category": "visualization",
        "source": "linesight/regression/multiple/visualization/plot_feature_importance.py",
        "shortDesc": "Bar chart of |coefficient| for each feature (excluding intercept), sorted descending.",
        "longDesc": "Horizontal line at mean importance for reference.",
        "parameters": [
          {
            "name": "display",
            "type": "bool",
            "default": "True",
            "required": false,
            "desc": "Input parameter `display`."
          }
        ],
        "returns": {
          "type": "matplotlib.figure.Figure",
          "desc": "Output of the plot_feature_importance function."
        },
        "raises": [],
        "warns": [],
        "internalSteps": [
          "Execute plot_feature_importance processing",
          "Render or return the output"
        ],
        "mathFormula": null,
        "example": "# 5. Graph the standardized coefficients to compare feature impact\nfig = model.plot_feature_importance(display=False)\nfig.savefig('feature_importance.png')",
        "outputImage": "assets/outputs/multiple/plot_feature_importance.png"
      },
      "plot_fit": {
        "name": "plot_fit",
        "signature": "model.plot_fit(X, y, display: bool = True)",
        "category": "visualization",
        "source": "linesight/regression/multiple/visualization/plot_fit.py",
        "shortDesc": "For 1-feature: scatter + line. For 2-feature: 3D surface + scatter.",
        "longDesc": "For >2 features: actual vs predicted scatter with diagonal identity line.",
        "parameters": [
          {
            "name": "X",
            "type": "array-like",
            "default": null,
            "required": true,
            "desc": "Input parameter `X`."
          },
          {
            "name": "y",
            "type": "array-like",
            "default": null,
            "required": true,
            "desc": "Input parameter `y`."
          },
          {
            "name": "display",
            "type": "bool",
            "default": "True",
            "required": false,
            "desc": "Input parameter `display`."
          }
        ],
        "returns": {
          "type": "matplotlib.figure.Figure",
          "desc": "Output of the plot_fit function."
        },
        "raises": [],
        "warns": [],
        "internalSteps": [
          "Execute plot_fit processing",
          "Render or return the output"
        ],
        "mathFormula": null,
        "example": "# 2. View 2D projections of features vs y with best fit lines\nfig = model.plot_fit(X, y, display=False)\nfig.savefig('multiple_fit.png')",
        "outputImage": "assets/outputs/multiple/plot_fit.png"
      },
      "plot_learning_curve": {
        "name": "plot_learning_curve",
        "signature": "model.plot_learning_curve(X, y, cv_splits: int = 5, train_sizes=None, display: bool = True)",
        "category": "visualization",
        "source": "linesight/regression/multiple/visualization/plot_learning_curve.py",
        "shortDesc": "Show how model performance changes as training dataset size grows.",
        "longDesc": "What is drawn\n-------------\n- X-axis: number of training samples used\n- Y-axis: R² score (or accuracy for logistic)\n- Blue line: training score at each dataset size\n- Red line: validation score at each dataset size\nWhat this teaches\n-----------------\n- If training score is high but validation score is low at ALL sizes:\nthe model is overfitting regardless of data size\n- If both scores are low and flat: the model is underfitting — more\ndata won't help, the model type is wrong\n- If validation score is rising and approaching training score as n grows:\ngetting more data WILL help\nAlgorithm\n---------\nFor each train_size in train_sizes:\n1. Take first train_size samples as training set\n2. Use the remaining as validation set\n3. Fit a temporary model on training set\n4. Score on both sets\n5. Repeat cv_splits times with different random subsets, take mean",
        "parameters": [
          {
            "name": "X",
            "type": "array-like",
            "default": null,
            "required": true,
            "desc": ""
          },
          {
            "name": "y",
            "type": "array-like",
            "default": null,
            "required": true,
            "desc": ""
          },
          {
            "name": "cv_splits",
            "type": "int, default 5",
            "default": "5",
            "required": false,
            "desc": "Number of random subsets to average for each train size. Higher = smoother curve but slower."
          },
          {
            "name": "train_sizes",
            "type": "list of int, optional",
            "default": null,
            "required": false,
            "desc": "Default: 10 evenly-spaced sizes from 10% to 90% of dataset."
          },
          {
            "name": "display",
            "type": "bool, default True",
            "default": "True",
            "required": false,
            "desc": ""
          }
        ],
        "returns": {
          "type": "matplotlib.figure.Figure",
          "desc": "Output of the plot_learning_curve function."
        },
        "raises": [],
        "warns": [],
        "internalSteps": [
          "Execute plot_learning_curve processing",
          "Render or return the output"
        ],
        "mathFormula": null,
        "example": "# Instantiate and train model\nmodel = MultipleLinearRegression()\nmodel.fit(X, y)\n\n# Call method\nmodel.plot_learning_curve(X, y)",
        "outputImage": "assets/outputs/multiple/plot_learning_curve.png"
      },
      "plot_multicollinearity": {
        "name": "plot_multicollinearity",
        "signature": "model.plot_multicollinearity(X, display: bool = True)",
        "category": "visualization",
        "source": "linesight/regression/multiple/visualization/plot_multicollinearity.py",
        "shortDesc": "Diagnose multicollinearity using a correlation heatmap + VIF scores.",
        "longDesc": "Two panels\n----------\nLeft: Correlation heatmap\n- Pearson correlation between every pair of features\n- Cells with |r| > 0.85 are outlined in red (dangerous)\n- Diagonal is 1.0 (self-correlation, always white)\nRight: VIF bar chart\nVIF (Variance Inflation Factor) for each feature.\nFormula: VIF_j = 1 / (1 - R²_j)\nwhere R²_j = R² from regressing feature j on all OTHER features.\nInterpretation:\nVIF = 1.0   : No correlation with other features (ideal)\nVIF = 1–5   : Acceptable\nVIF = 5–10  : Concerning — coefficients may be unstable\nVIF > 10    : Dangerous — coefficients are unreliable\nVIF → ∞     : Perfect multicollinearity (feature is linear combo of others)\nVIF > 10 bars colored red. VIF 5–10 orange. Below 5 green.\nWhat this teaches\n-----------------\nWhen two features are highly correlated, the model cannot distinguish\ntheir individual effects. The coefficients become unstable — a tiny\nchange in data can flip them dramatically. VIF quantifies this danger.",
        "parameters": [
          {
            "name": "X",
            "type": "array-like, shape (n, p) — p must be >= 2",
            "default": null,
            "required": true,
            "desc": ""
          },
          {
            "name": "display",
            "type": "bool, default True",
            "default": "True",
            "required": false,
            "desc": ""
          }
        ],
        "returns": {
          "type": "matplotlib.figure.Figure",
          "desc": "Output of the plot_multicollinearity function."
        },
        "raises": [
          {
            "exception": "LineSightShapeError",
            "condition": "",
            "message": "If p < 2: \"plot_multicollinearity() requires at least 2 features. Your X has only 1 feature. Multicollinearity is a multi-feature problem.\" "
          }
        ],
        "warns": [],
        "internalSteps": [
          "Execute plot_multicollinearity processing",
          "Render or return the output"
        ],
        "mathFormula": null,
        "example": "# 7. Check collinearity using Variance Inflation Factor (VIF) and tolerance\nfig = model.plot_multicollinearity(X, display=False)\nfig.savefig('multicollinearity.png')",
        "outputImage": "assets/outputs/multiple/plot_multicollinearity.png"
      },
      "plot_partial_regression": {
        "name": "plot_partial_regression",
        "signature": "model.plot_partial_regression(X, y, feature_idx: int = 0, display: bool = True)",
        "category": "visualization",
        "source": "linesight/regression/multiple/visualization/plot_partial_regression.py",
        "shortDesc": "Marginal effect of one feature while ALL others are held at their training mean.",
        "longDesc": "The held-at values are shown in the plot subtitle.",
        "parameters": [
          {
            "name": "X",
            "type": "array-like",
            "default": null,
            "required": true,
            "desc": "Input parameter `X`."
          },
          {
            "name": "y",
            "type": "array-like",
            "default": null,
            "required": true,
            "desc": "Input parameter `y`."
          },
          {
            "name": "feature_idx",
            "type": "any",
            "default": "0",
            "required": false,
            "desc": "Input parameter `feature_idx`."
          },
          {
            "name": "display",
            "type": "bool",
            "default": "True",
            "required": false,
            "desc": "Input parameter `display`."
          }
        ],
        "returns": {
          "type": "matplotlib.figure.Figure",
          "desc": "Output of the plot_partial_regression function."
        },
        "raises": [],
        "warns": [],
        "internalSteps": [
          "Execute plot_partial_regression processing",
          "Render or return the output"
        ],
        "mathFormula": null,
        "example": "# 4. Generate partial regression plots (Added-Variable plots) for each feature\nfig = model.plot_partial_regression(X, y, display=False)\nfig.savefig('partial_regression.png')",
        "outputImage": "assets/outputs/multiple/plot_partial_regression.png"
      },
      "plot_prediction_plane": {
        "name": "plot_prediction_plane",
        "signature": "model.plot_prediction_plane(X, y, display: bool = True)",
        "category": "visualization",
        "source": "linesight/regression/multiple/visualization/plot_prediction_plane.py",
        "shortDesc": "3D scatter + prediction plane. Only for exactly 2-feature models.",
        "longDesc": "3D scatter + prediction plane. Only for exactly 2-feature models.",
        "parameters": [
          {
            "name": "X",
            "type": "array-like",
            "default": null,
            "required": true,
            "desc": "Input parameter `X`."
          },
          {
            "name": "y",
            "type": "array-like",
            "default": null,
            "required": true,
            "desc": "Input parameter `y`."
          },
          {
            "name": "display",
            "type": "bool",
            "default": "True",
            "required": false,
            "desc": "Input parameter `display`."
          }
        ],
        "returns": {
          "type": "matplotlib.figure.Figure",
          "desc": "Output of the plot_prediction_plane function."
        },
        "raises": [],
        "warns": [],
        "internalSteps": [
          "Execute plot_prediction_plane processing",
          "Render or return the output"
        ],
        "mathFormula": null,
        "example": "# 3. Render the 3D regression plane (works for exactly 2 features)\nfig = model.plot_prediction_plane(X, y, display=False)\nfig.savefig('prediction_plane.png')",
        "outputImage": "assets/outputs/multiple/plot_prediction_plane.png"
      },
      "plot_residual_heatmap": {
        "name": "plot_residual_heatmap",
        "signature": "model.plot_residual_heatmap(X, y, display: bool = True)",
        "category": "visualization",
        "source": "linesight/regression/multiple/visualization/plot_residual_heatmap.py",
        "shortDesc": "Heatmap of residuals vs features: reveals which feature ranges cause errors.",
        "longDesc": "Layout\n------\nTop panel: Residual bar chart (per sample, sorted by residual magnitude)\nBottom panel: Feature value heatmap (same sample order)\n- Each row = one feature\n- Each column = one sample (sorted by residual)\n- Color = z-scored feature value (high = dark, low = light)\nIf prediction errors cluster in columns where a feature is high/low,\nthat feature is systematically related to the error — a signal that\nthe model needs that feature transformed or a new interaction term added.",
        "parameters": [
          {
            "name": "X",
            "type": "array-like, shape (n, p)",
            "default": null,
            "required": true,
            "desc": ""
          },
          {
            "name": "y",
            "type": "array-like, shape (n,)",
            "default": null,
            "required": true,
            "desc": ""
          },
          {
            "name": "display",
            "type": "bool, default True",
            "default": "True",
            "required": false,
            "desc": ""
          }
        ],
        "returns": {
          "type": "matplotlib.figure.Figure",
          "desc": "Output of the plot_residual_heatmap function."
        },
        "raises": [],
        "warns": [
          {
            "warning": "LineSightDataWarning",
            "condition": "if p > 20:",
            "message": "\"Your model has {p} features. The heatmap may be unreadable. Consider visualizing subsets of features.\" "
          }
        ],
        "internalSteps": [
          "Execute plot_residual_heatmap processing",
          "Render or return the output"
        ],
        "mathFormula": null,
        "example": "# 8. Render a residual heatmap to detect spatial or systematic patterns\nfig = model.plot_residual_heatmap(X, y, display=False)\nfig.savefig('residual_heatmap.png')",
        "outputImage": "assets/outputs/multiple/plot_residual_heatmap.png"
      },
      "show_equation": {
        "name": "show_equation",
        "signature": "model.show_equation() -> str",
        "category": "explain",
        "source": "linesight/regression/multiple/explain/show_equation.py",
        "shortDesc": "Print the learned multivariate equation.",
        "longDesc": "Print the learned multivariate equation.",
        "parameters": [],
        "returns": {
          "type": "str",
          "desc": "Output of the show_equation function."
        },
        "raises": [],
        "warns": [],
        "internalSteps": [
          "Execute show_equation processing",
          "Render or return the output"
        ],
        "mathFormula": null,
        "example": "# Instantiate and train model\nmodel = MultipleLinearRegression()\nmodel.fit(X, y)\n\n# Call method\nmodel.show_equation()",
        "outputImage": null
      }
    }
  },
  "PolynomialRegression": {
    "conceptTheory": "Polynomial Regression models non-linear relationships by raising the input feature x to higher powers.",
    "learningObjective": "Map a 1D feature into a multi-dimensional polynomial space to fit non-linear curves.",
    "implementationStrategy": "Expand X into polynomial features [x, x², ..., xᵈ] and fit coefficients using Multiple Linear Regression.",
    "visualDiagram_path": "assets/diagrams/polynomial_concept.png",
    "outputImage_path": "assets/outputs/polynomial/plot_fit.png",
    "unique_functions": {
      "animate_degree_increase": {
        "name": "animate_degree_increase",
        "signature": "model.animate_degree_increase(X, y, max_degree: int = 9, interval: int = 800, display: bool = True)",
        "category": "visualization",
        "source": "linesight/regression/polynomial/visualization/animate_degree_increase.py",
        "shortDesc": "Animate the polynomial curve changing as degree increases from 1 to max_degree.",
        "longDesc": "What this teaches\n-----------------\nStudents watch the curve go from a straight line (degree 1) through\nincreasing flexibility, and eventually start fitting noise (overfitting).\nThis is the single clearest possible demonstration of the bias-variance\ntradeoff: low degree = high bias (underfit), high degree = high variance (overfit).\nEach frame shows one degree. The curve re-fits from scratch for each degree.\nThe title shows: \"Degree N — R² = 0.923\"",
        "parameters": [
          {
            "name": "X",
            "type": "array-like",
            "default": null,
            "required": true,
            "desc": ""
          },
          {
            "name": "y",
            "type": "array-like",
            "default": null,
            "required": true,
            "desc": ""
          },
          {
            "name": "max_degree",
            "type": "int, default 9",
            "default": "9",
            "required": false,
            "desc": ""
          },
          {
            "name": "interval",
            "type": "int, default 800",
            "default": "800",
            "required": false,
            "desc": "Milliseconds per frame. 800ms lets students read the R² before moving on."
          },
          {
            "name": "display",
            "type": "bool, default True",
            "default": "True",
            "required": false,
            "desc": ""
          }
        ],
        "returns": {
          "type": "matplotlib.animation.FuncAnimation",
          "desc": "Output of the animate_degree_increase function."
        },
        "raises": [],
        "warns": [],
        "internalSteps": [
          "Execute animate_degree_increase processing",
          "Render or return the output"
        ],
        "mathFormula": null,
        "example": "# 4. Animate the fit curve changing as degree increases from 1 to 9\nanim = model.animate_degree_increase(X, y, max_degree=9, display=False)\nanim.save('degree_increase.gif', writer='pillow')",
        "outputImage": "assets/outputs/polynomial/animate_degree_increase.gif"
      },
      "compare_degrees": {
        "name": "compare_degrees",
        "signature": "model.compare_degrees(X, y, degrees=None, display: bool = True)",
        "category": "core",
        "source": "linesight/regression/polynomial/visualization/compare_degrees.py",
        "shortDesc": "THIS IS THE MOST EDUCATIONAL VISUALIZATION IN THE ENTIRE LIBRARY.",
        "longDesc": "Fit the same data with multiple polynomial degrees and show all fits\nside by side. Makes overfitting and underfitting immediately visible.\nWhat is drawn\n-------------\nOne subplot per degree. Each shows:\n- Scatter of data points\n- The polynomial curve for that degree\n- R² score in the title\n- A qualitative label: \"Underfit\" / \"Good fit\" / \"Overfit\"\nThe labels are determined by:\n- R² < 0.6  → \"Underfit\"\n- R² >= 0.6 and R² < 0.98 → \"Good fit\"\n- R² >= 0.98 → \"Overfit (probably)\" — because very high R² on training\ndata with high degree usually means the model memorized the noise\nThis distinction is heuristic and documented as such. The student\nshould verify on validation data. The label plants the concept.",
        "parameters": [
          {
            "name": "X",
            "type": "array-like",
            "default": null,
            "required": true,
            "desc": ""
          },
          {
            "name": "y",
            "type": "array-like",
            "default": null,
            "required": true,
            "desc": ""
          },
          {
            "name": "degrees",
            "type": "list of int, default [1, 2, 3, 5, 9]",
            "default": null,
            "required": false,
            "desc": ""
          },
          {
            "name": "display",
            "type": "bool, default True",
            "default": "True",
            "required": false,
            "desc": "Side effects Creates temporary PolynomialRegression instances. Does not modify self."
          }
        ],
        "returns": {
          "type": "self",
          "desc": "Output of the compare_degrees function."
        },
        "raises": [],
        "warns": [],
        "internalSteps": [
          "Execute compare_degrees processing",
          "Render or return the output"
        ],
        "mathFormula": null,
        "example": "# Instantiate and train model\nmodel = PolynomialRegression()\nmodel.fit(X, y)\n\n# Call method\nmodel.compare_degrees(X, y)",
        "outputImage": null
      },
      "fit": {
        "name": "fit",
        "signature": "model.fit(X, y)",
        "category": "core",
        "source": "linesight/regression/polynomial/engine/fit.py",
        "shortDesc": "Fit polynomial regression by expanding X to degree d then running",
        "longDesc": "gradient descent on the expanded feature matrix.\nThe model learns coefficients [b, a₁, a₂, ..., aᵈ] where:\nŷ = b + a₁x + a₂x² + ... + aᵈxᵈ\nStored as self.theta_ shape (degree + 1,):\ntheta_[0] = intercept b\ntheta_[1] = coefficient for x¹\ntheta_[2] = coefficient for x²\n...",
        "parameters": [
          {
            "name": "X",
            "type": "array-like, shape (n,) or (n, 1) — single feature only",
            "default": null,
            "required": true,
            "desc": ""
          },
          {
            "name": "y",
            "type": "array-like, shape (n,)",
            "default": null,
            "required": true,
            "desc": ""
          }
        ],
        "returns": {
          "type": "self",
          "desc": "Output of the fit function."
        },
        "raises": [
          {
            "exception": "LineSightShapeError",
            "condition": "if X has more than 1 feature.",
            "message": ""
          },
          {
            "exception": "Polynomial",
            "condition": "regression in LineSight is intentionally single-feature.",
            "message": ""
          },
          {
            "exception": "For",
            "condition": "multi-feature polynomial, use PolynomialFeatures + MultipleLinearRegression",
            "message": ""
          },
          {
            "exception": "(document",
            "condition": "this clearly).",
            "message": ""
          }
        ],
        "warns": [],
        "internalSteps": [
          "Execute fit processing",
          "Render or return the output"
        ],
        "mathFormula": null,
        "example": "import numpy as np\nfrom linesight import PolynomialRegression\n\n# Generate quadratic synthetic data\nx = np.linspace(1, 10, 40)\ny = 0.5 * x**2 - 3.2 * x + 1.5 + np.random.randn(40) * 1.5\nX = x.reshape(-1, 1)\n\n# 1. Initialize and fit Polynomial Regression (degree=2)\nmodel = PolynomialRegression(degree=2, learning_rate=0.002, normalize=True)\nmodel.fit(X, y)",
        "outputImage": null
      },
      "plot_actual_vs_predicted": {
        "name": "plot_actual_vs_predicted",
        "signature": "model.plot_actual_vs_predicted(X, y, display: bool = True)",
        "category": "visualization",
        "source": "linesight/regression/polynomial/visualization/plot_actual_vs_predicted.py",
        "shortDesc": "Scatter plot of actual y values vs predicted ŷ values.",
        "longDesc": "What is drawn\n-------------\n- X-axis: actual y values\n- Y-axis: predicted ŷ values\n- Diagonal line y=x (the \"perfect prediction\" line)\n- Each point is one sample\n- Points above the diagonal = model overestimated\n- Points below the diagonal = model underestimated\n- R² shown in corner\nWhy this matters\n----------------\nThis works for ALL regression types regardless of number of features,\nbecause both axes are scalar (y and ŷ). It is the universal fit diagnostic.\nplot_fit() only works for 1-feature models. This one always works.\nA tight cloud around the diagonal = good fit.\nA curved cloud = the relationship is non-linear (try polynomial).\nFunnel shape = heteroscedasticity.",
        "parameters": [
          {
            "name": "X",
            "type": "array-like",
            "default": null,
            "required": true,
            "desc": "Input parameter `X`."
          },
          {
            "name": "y",
            "type": "array-like",
            "default": null,
            "required": true,
            "desc": "Input parameter `y`."
          },
          {
            "name": "display",
            "type": "bool",
            "default": "True",
            "required": false,
            "desc": "Input parameter `display`."
          }
        ],
        "returns": {
          "type": "matplotlib.figure.Figure",
          "desc": "Output of the plot_actual_vs_predicted function."
        },
        "raises": [],
        "warns": [],
        "internalSteps": [
          "Execute plot_actual_vs_predicted processing",
          "Render or return the output"
        ],
        "mathFormula": null,
        "example": "# Instantiate and train model\nmodel = PolynomialRegression()\nmodel.fit(X, y)\n\n# Call method\nmodel.plot_actual_vs_predicted(X, y)",
        "outputImage": "assets/outputs/polynomial/plot_actual_vs_predicted.png"
      },
      "plot_basis_functions": {
        "name": "plot_basis_functions",
        "signature": "model.plot_basis_functions(X, y, display: bool = True)",
        "category": "visualization",
        "source": "linesight/regression/polynomial/visualization/plot_basis_functions.py",
        "shortDesc": "Decompose the polynomial fit into its individual basis function components.",
        "longDesc": "What is drawn\n-------------\nTop panel: Each scaled basis function as a separate colored line\n- \"a₁·x¹\" as one curve\n- \"a₂·x²\" as another\n- etc.\n- The intercept b shown as a horizontal dashed line\n- The SUM (final fit) shown as a thick blue line\nBottom panel: The data scatter with final fit overlaid",
        "parameters": [
          {
            "name": "X",
            "type": "array-like, shape (n, 1)",
            "default": null,
            "required": true,
            "desc": ""
          },
          {
            "name": "y",
            "type": "array-like, shape (n,)",
            "default": null,
            "required": true,
            "desc": ""
          },
          {
            "name": "display",
            "type": "bool, default True",
            "default": "True",
            "required": false,
            "desc": ""
          }
        ],
        "returns": {
          "type": "matplotlib.figure.Figure",
          "desc": "Output of the plot_basis_functions function."
        },
        "raises": [
          {
            "exception": "LineSightShapeError",
            "condition": "",
            "message": "If model has degree > 8: \"plot_basis_functions() supports up to degree 8 for readability. Your model has degree {d}. The plot would have {d} overlapping curves.\" "
          }
        ],
        "warns": [],
        "internalSteps": [
          "Execute plot_basis_functions processing",
          "Render or return the output"
        ],
        "mathFormula": null,
        "example": "# 3. View the generated polynomial basis features (X, X², etc.)\nfig = model.plot_basis_functions(X, display=False)\nfig.savefig('basis_functions.png')",
        "outputImage": "assets/outputs/polynomial/plot_basis_functions.png"
      },
      "plot_fit": {
        "name": "plot_fit",
        "signature": "model.plot_fit(X, y, show_residuals: bool = True, display: bool = True)",
        "category": "visualization",
        "source": "linesight/regression/polynomial/visualization/plot_fit.py",
        "shortDesc": "Plot raw data, the fitted polynomial curve, and optional residuals.",
        "longDesc": "Key difference from LinearRegression.plot_fit\n----------------------------------------------\nThe fit line is a SMOOTH CURVE, not a straight line.\nWe generate 300 evenly-spaced x values from min to max and predict on them.\nThis produces the smooth polynomial curve the model has learned.\nWhat is drawn\n-------------\n1. Scatter of data points\n2. Smooth polynomial curve (300 points for smoothness)\n3. If show_residuals=True: vertical dashed bars from each point to the\nNEAREST POINT ON THE CURVE (not to the line, since there is no line).\nThese bars are approximated by finding the curve's y at each data x.\n4. Degree annotation in corner: \"Degree 3 polynomial\"",
        "parameters": [
          {
            "name": "X",
            "type": "array-like",
            "default": null,
            "required": true,
            "desc": "Input parameter `X`."
          },
          {
            "name": "y",
            "type": "array-like",
            "default": null,
            "required": true,
            "desc": "Input parameter `y`."
          },
          {
            "name": "show_residuals",
            "type": "any",
            "default": "True",
            "required": false,
            "desc": "Input parameter `show_residuals`."
          },
          {
            "name": "display",
            "type": "bool",
            "default": "True",
            "required": false,
            "desc": "Input parameter `display`."
          }
        ],
        "returns": {
          "type": "matplotlib.figure.Figure",
          "desc": "Output of the plot_fit function."
        },
        "raises": [],
        "warns": [],
        "internalSteps": [
          "Execute plot_fit processing",
          "Render or return the output"
        ],
        "mathFormula": null,
        "example": "# 2. Plot the fitted polynomial curve passing through data points\nfig = model.plot_fit(X, y, display=False)\nfig.savefig('polynomial_fit.png')",
        "outputImage": "assets/outputs/polynomial/plot_fit.png"
      },
      "plot_learning_curve": {
        "name": "plot_learning_curve",
        "signature": "model.plot_learning_curve(X, y, cv_splits: int = 5, train_sizes=None, display: bool = True)",
        "category": "visualization",
        "source": "linesight/regression/polynomial/visualization/plot_learning_curve.py",
        "shortDesc": "Show how model performance changes as training dataset size grows.",
        "longDesc": "What is drawn\n-------------\n- X-axis: number of training samples used\n- Y-axis: R² score (or accuracy for logistic)\n- Blue line: training score at each dataset size\n- Red line: validation score at each dataset size\nWhat this teaches\n-----------------\n- If training score is high but validation score is low at ALL sizes:\nthe model is overfitting regardless of data size\n- If both scores are low and flat: the model is underfitting — more\ndata won't help, the model type is wrong\n- If validation score is rising and approaching training score as n grows:\ngetting more data WILL help\nAlgorithm\n---------\nFor each train_size in train_sizes:\n1. Take first train_size samples as training set\n2. Use the remaining as validation set\n3. Fit a temporary model on training set\n4. Score on both sets\n5. Repeat cv_splits times with different random subsets, take mean",
        "parameters": [
          {
            "name": "X",
            "type": "array-like",
            "default": null,
            "required": true,
            "desc": ""
          },
          {
            "name": "y",
            "type": "array-like",
            "default": null,
            "required": true,
            "desc": ""
          },
          {
            "name": "cv_splits",
            "type": "int, default 5",
            "default": "5",
            "required": false,
            "desc": "Number of random subsets to average for each train size. Higher = smoother curve but slower."
          },
          {
            "name": "train_sizes",
            "type": "list of int, optional",
            "default": null,
            "required": false,
            "desc": "Default: 10 evenly-spaced sizes from 10% to 90% of dataset."
          },
          {
            "name": "display",
            "type": "bool, default True",
            "default": "True",
            "required": false,
            "desc": ""
          }
        ],
        "returns": {
          "type": "matplotlib.figure.Figure",
          "desc": "Output of the plot_learning_curve function."
        },
        "raises": [],
        "warns": [],
        "internalSteps": [
          "Execute plot_learning_curve processing",
          "Render or return the output"
        ],
        "mathFormula": null,
        "example": "# Instantiate and train model\nmodel = PolynomialRegression()\nmodel.fit(X, y)\n\n# Call method\nmodel.plot_learning_curve(X, y)",
        "outputImage": "assets/outputs/polynomial/plot_learning_curve.png"
      },
      "plot_loss_curve": {
        "name": "plot_loss_curve",
        "signature": "model.plot_loss_curve(display: bool = True)",
        "category": "visualization",
        "source": "linesight/regression/linear/visualization/plot_loss_curve.py",
        "shortDesc": "Plot the training loss over epochs.",
        "longDesc": "Requires store_history=True during fit().\nWhat is drawn\n-------------\n- X-axis: epoch number\n- Y-axis: MSE loss\n- Final loss value annotated on the last point\n- The curve shape teaches: fast initial drop, then slow convergence",
        "parameters": [
          {
            "name": "display",
            "type": "bool, default True",
            "default": "True",
            "required": false,
            "desc": ""
          }
        ],
        "returns": {
          "type": "matplotlib.figure.Figure",
          "desc": "Output of the plot_loss_curve function."
        },
        "raises": [],
        "warns": [
          {
            "warning": "LineSightDataWarning",
            "condition": "if store_history=False",
            "message": ""
          }
        ],
        "internalSteps": [
          "Execute plot_loss_curve processing",
          "Render or return the output"
        ],
        "mathFormula": null,
        "example": "# Instantiate and train model\nmodel = PolynomialRegression()\nmodel.fit(X, y)\n\n# Call method\nmodel.plot_loss_curve(X, y)",
        "outputImage": "assets/outputs/polynomial/plot_loss_curve.png"
      },
      "plot_residuals": {
        "name": "plot_residuals",
        "signature": "model.plot_residuals(X, y, display: bool = True)",
        "category": "visualization",
        "source": "linesight/regression/linear/visualization/plot_residuals.py",
        "shortDesc": "Plot residuals (actual - predicted) against fitted values.",
        "longDesc": "What is drawn\n-------------\n- X-axis: fitted values (y_hat)\n- Y-axis: residuals (y - y_hat)\n- Horizontal dashed line at y=0 (where a perfect model would sit)\n- Points colored red (positive residual = underprediction)\nand blue (negative residual = overprediction)\nWhat to look for\n----------------\n- Random scatter around zero = good fit, assumptions met\n- Curved pattern = linear model is wrong, try polynomial\n- Funnel shape = heteroscedasticity (variance increases with fitted value)\n- Outliers far from zero = influential data points",
        "parameters": [
          {
            "name": "X",
            "type": "array-like",
            "default": null,
            "required": true,
            "desc": ""
          },
          {
            "name": "y",
            "type": "array-like",
            "default": null,
            "required": true,
            "desc": ""
          },
          {
            "name": "display",
            "type": "bool, default True",
            "default": "True",
            "required": false,
            "desc": ""
          }
        ],
        "returns": {
          "type": "matplotlib.figure.Figure",
          "desc": "Output of the plot_residuals function."
        },
        "raises": [],
        "warns": [],
        "internalSteps": [
          "Execute plot_residuals processing",
          "Render or return the output"
        ],
        "mathFormula": null,
        "example": "# Instantiate and train model\nmodel = PolynomialRegression()\nmodel.fit(X, y)\n\n# Call method\nmodel.plot_residuals(X, y)",
        "outputImage": "assets/outputs/polynomial/plot_residuals.png"
      },
      "show_equation": {
        "name": "show_equation",
        "signature": "model.show_equation() -> str",
        "category": "explain",
        "source": "linesight/regression/polynomial/explain/show_equation.py",
        "shortDesc": "Display the learned polynomial equation.",
        "longDesc": "Example output for degree=3:\nŷ = 1.2000 + 3.4200x¹ - 0.8100x² + 0.0340x³\nSuperscript formatting uses unicode characters for readability.",
        "parameters": [],
        "returns": {
          "type": "str",
          "desc": "Output of the show_equation function."
        },
        "raises": [],
        "warns": [],
        "internalSteps": [
          "Execute show_equation processing",
          "Render or return the output"
        ],
        "mathFormula": null,
        "example": "# Instantiate and train model\nmodel = PolynomialRegression()\nmodel.fit(X, y)\n\n# Call method\nmodel.show_equation()",
        "outputImage": null
      }
    }
  },
  "RidgeRegression": {
    "conceptTheory": "Ridge Regression mitigates multicollinearity by adding an L2 regularization penalty to the MSE loss function.",
    "learningObjective": "Shrink regression coefficients toward zero to reduce model variance and prevent overfitting.",
    "implementationStrategy": "Add alpha * sum(w²) to the loss and compute penalized gradients during training.",
    "visualDiagram_path": "assets/diagrams/ridge_concept.png",
    "outputImage_path": "assets/outputs/ridge/plot_fit.png",
    "unique_functions": {
      "animate_regularization": {
        "name": "animate_regularization",
        "signature": "model.animate_regularization(X, y, alphas=None, interval: int = 300, display: bool = True)",
        "category": "visualization",
        "source": "linesight/regression/ridge/visualization/animate_regularization.py",
        "shortDesc": "Animate how the Ridge regression line changes as alpha increases.",
        "longDesc": "Only works for single-feature models (so the line can be shown directly).\nFor multi-feature models, use plot_coefficient_shrinkage() instead.\nWhat is drawn\n-------------\nEach frame fits a Ridge model with a different alpha and shows:\n- The regression line for that alpha\n- Current coefficient values in the corner\n- Title: \"Alpha = 0.001 → line is flexible\"\n\"Alpha = 100.0 → line is nearly flat (over-regularized)\"\nWhat this teaches\n-----------------\nStudents watch the line physically stiffen as alpha increases.\nAt very high alpha, the line approaches the horizontal mean line,\nbecause the model has been forced to make all coefficients near zero.",
        "parameters": [
          {
            "name": "X",
            "type": "array-like, shape (n, 1) — single feature required",
            "default": null,
            "required": true,
            "desc": ""
          },
          {
            "name": "y",
            "type": "array-like, shape (n,)",
            "default": null,
            "required": true,
            "desc": ""
          },
          {
            "name": "alphas",
            "type": "list of float, optional",
            "default": null,
            "required": false,
            "desc": "Default: 30 values log-spaced from 1e-4 to 1e3"
          },
          {
            "name": "interval",
            "type": "int, default 300",
            "default": "300",
            "required": false,
            "desc": ""
          },
          {
            "name": "display",
            "type": "bool, default True",
            "default": "True",
            "required": false,
            "desc": ""
          }
        ],
        "returns": {
          "type": "matplotlib.animation.FuncAnimation",
          "desc": "Output of the animate_regularization function."
        },
        "raises": [],
        "warns": [],
        "internalSteps": [
          "Execute animate_regularization processing",
          "Render or return the output"
        ],
        "mathFormula": null,
        "example": "# 7. Animate the fit line shifting as alpha sweeps from 10^-3 to 10^2\nx_1d = X[:, 0].reshape(-1, 1)\ny_1d = y\nanim = model.animate_regularization(x_1d, y_1d, alphas=np.logspace(-3, 2, 20), display=False)\nanim.save('ridge_regularization.gif', writer='pillow')",
        "outputImage": "assets/outputs/ridge/animate_regularization.gif"
      },
      "compare_with_linear": {
        "name": "compare_with_linear",
        "signature": "model.compare_with_linear(X, y, display: bool = True)",
        "category": "core",
        "source": "linesight/regression/ridge/visualization/compare_with_linear.py",
        "shortDesc": "Side-by-side comparison: Ridge (current model) vs unregularized Linear.",
        "longDesc": "Shows coefficient magnitudes and R^2 for both.",
        "parameters": [
          {
            "name": "X",
            "type": "array-like",
            "default": null,
            "required": true,
            "desc": "Input parameter `X`."
          },
          {
            "name": "y",
            "type": "array-like",
            "default": null,
            "required": true,
            "desc": "Input parameter `y`."
          },
          {
            "name": "display",
            "type": "bool",
            "default": "True",
            "required": false,
            "desc": "Input parameter `display`."
          }
        ],
        "returns": {
          "type": "self",
          "desc": "Output of the compare_with_linear function."
        },
        "raises": [],
        "warns": [],
        "internalSteps": [
          "Execute compare_with_linear processing",
          "Render or return the output"
        ],
        "mathFormula": null,
        "example": "# Instantiate and train model\nmodel = RidgeRegression()\nmodel.fit(X, y)\n\n# Call method\nmodel.compare_with_linear(X, y)",
        "outputImage": null
      },
      "explain_coefficients": {
        "name": "explain_coefficients",
        "signature": "model.explain_coefficients() -> str",
        "category": "explain",
        "source": "linesight/regression/ridge/explain/explain_coefficients.py",
        "shortDesc": "Print the Ridge coefficients with a note about L2 shrinkage.",
        "longDesc": "Print the Ridge coefficients with a note about L2 shrinkage.",
        "parameters": [],
        "returns": {
          "type": "str",
          "desc": "Output of the explain_coefficients function."
        },
        "raises": [],
        "warns": [],
        "internalSteps": [
          "Execute explain_coefficients processing",
          "Render or return the output"
        ],
        "mathFormula": null,
        "example": "# Instantiate and train model\nmodel = RidgeRegression()\nmodel.fit(X, y)\n\n# Call method\nmodel.explain_coefficients()",
        "outputImage": null
      },
      "explain_regularization": {
        "name": "explain_regularization",
        "signature": "model.explain_regularization() -> str",
        "category": "explain",
        "source": "linesight/regression/ridge/explain/explain_regularization.py",
        "shortDesc": "Print a plain-English explanation of what alpha (L2 regularization) is doing.",
        "longDesc": "Shows current alpha and the sum of squared coefficients.",
        "parameters": [],
        "returns": {
          "type": "str",
          "desc": "Output of the explain_regularization function."
        },
        "raises": [],
        "warns": [],
        "internalSteps": [
          "Execute explain_regularization processing",
          "Render or return the output"
        ],
        "mathFormula": null,
        "example": "# 2. Get step-by-step mathematical details of the L2 regularizer\nmodel.explain_regularization()",
        "outputImage": null
      },
      "fit": {
        "name": "fit",
        "signature": "model.fit(X, y)",
        "category": "core",
        "source": "linesight/regression/ridge/engine/fit.py",
        "shortDesc": "Train Ridge regression: y_pred = dot(X, weights) + bias, with L2 regularization penalty.",
        "longDesc": "If normalize=True (default False), standardizes each feature to\nmean=0 / std=1 before training. Prevents gradient explosion on\nmixed-scale features. Predictions are automatically un-scaled.",
        "parameters": [
          {
            "name": "X",
            "type": "array-like",
            "default": null,
            "required": true,
            "desc": "Input parameter `X`."
          },
          {
            "name": "y",
            "type": "array-like",
            "default": null,
            "required": true,
            "desc": "Input parameter `y`."
          }
        ],
        "returns": {
          "type": "self",
          "desc": "Output of the fit function."
        },
        "raises": [],
        "warns": [],
        "internalSteps": [
          "Execute fit processing",
          "Render or return the output"
        ],
        "mathFormula": "Loss J(w, b) = (1/n) * sum((y_pred_i - y_i)^2) + alpha * sum(w_j^2)\nUpdate: w := w - lr * (dJ/dw + 2 * alpha * w)",
        "example": "import numpy as np\nfrom linesight import RidgeRegression\n\n# Generate multicollinear synthetic dataset\nX = np.random.randn(50, 2)\ny = 1.5 * X[:, 0] - 2.0 * X[:, 1] + 1.0 + np.random.randn(50) * 0.5\n\n# 1. Initialize and fit Ridge Regression with L2 penalty (alpha=1.0)\nmodel = RidgeRegression(alpha=1.0, learning_rate=0.01, normalize=True)\nmodel.fit(X, y)",
        "outputImage": null
      },
      "plot_actual_vs_predicted": {
        "name": "plot_actual_vs_predicted",
        "signature": "model.plot_actual_vs_predicted(X, y, display: bool = True)",
        "category": "visualization",
        "source": "linesight/regression/ridge/visualization/plot_actual_vs_predicted.py",
        "shortDesc": "Scatter plot of actual y values vs predicted ŷ values.",
        "longDesc": "What is drawn\n-------------\n- X-axis: actual y values\n- Y-axis: predicted ŷ values\n- Diagonal line y=x (the \"perfect prediction\" line)\n- Each point is one sample\n- Points above the diagonal = model overestimated\n- Points below the diagonal = model underestimated\n- R² shown in corner\nWhy this matters\n----------------\nThis works for ALL regression types regardless of number of features,\nbecause both axes are scalar (y and ŷ). It is the universal fit diagnostic.\nplot_fit() only works for 1-feature models. This one always works.\nA tight cloud around the diagonal = good fit.\nA curved cloud = the relationship is non-linear (try polynomial).\nFunnel shape = heteroscedasticity.",
        "parameters": [
          {
            "name": "X",
            "type": "array-like",
            "default": null,
            "required": true,
            "desc": "Input parameter `X`."
          },
          {
            "name": "y",
            "type": "array-like",
            "default": null,
            "required": true,
            "desc": "Input parameter `y`."
          },
          {
            "name": "display",
            "type": "bool",
            "default": "True",
            "required": false,
            "desc": "Input parameter `display`."
          }
        ],
        "returns": {
          "type": "matplotlib.figure.Figure",
          "desc": "Output of the plot_actual_vs_predicted function."
        },
        "raises": [],
        "warns": [],
        "internalSteps": [
          "Execute plot_actual_vs_predicted processing",
          "Render or return the output"
        ],
        "mathFormula": null,
        "example": "# Instantiate and train model\nmodel = RidgeRegression()\nmodel.fit(X, y)\n\n# Call method\nmodel.plot_actual_vs_predicted(X, y)",
        "outputImage": "assets/outputs/ridge/plot_actual_vs_predicted.png"
      },
      "plot_bias_variance_tradeoff": {
        "name": "plot_bias_variance_tradeoff",
        "signature": "model.plot_bias_variance_tradeoff(X, y, alphas=None, display: bool = True)",
        "category": "visualization",
        "source": "linesight/regression/ridge/visualization/plot_bias_variance_tradeoff.py",
        "shortDesc": "Show training error and validation error as alpha (regularization) increases.",
        "longDesc": "What is drawn\n-------------\n- X-axis: alpha (log scale, increasing = more regularization)\n- Y-axis: MSE\n- Blue line: training MSE (always increases as alpha increases, model gets worse on training)\n- Red line: validation MSE (forms a U-shape: too little alpha = overfit,\ntoo much alpha = underfit, sweet spot in the middle)\n- Vertical dashed line marking the optimal alpha (min validation MSE)\nWhat this teaches\n-----------------\nThis is the bias-variance tradeoff made visible. It directly answers\n\"how do I choose alpha?\" — pick where validation MSE is lowest.",
        "parameters": [
          {
            "name": "X",
            "type": "array-like, shape (n, p)",
            "default": null,
            "required": true,
            "desc": ""
          },
          {
            "name": "y",
            "type": "array-like, shape (n,)",
            "default": null,
            "required": true,
            "desc": ""
          },
          {
            "name": "alphas",
            "type": "list of float, optional",
            "default": null,
            "required": false,
            "desc": "Default: 50 values log-spaced from 1e-4 to 1e2"
          },
          {
            "name": "display",
            "type": "bool, default True",
            "default": "True",
            "required": false,
            "desc": ""
          }
        ],
        "returns": {
          "type": "matplotlib.figure.Figure",
          "desc": "Output of the plot_bias_variance_tradeoff function."
        },
        "raises": [],
        "warns": [],
        "internalSteps": [
          "Execute plot_bias_variance_tradeoff processing",
          "Render or return the output"
        ],
        "mathFormula": null,
        "example": "# 5. Display the bias-variance tradeoff as regularization penalty varies\nfig = model.plot_bias_variance_tradeoff(X, y, alphas=np.logspace(-3, 3, 20), display=False)\nfig.savefig('bias_variance.png')",
        "outputImage": "assets/outputs/ridge/plot_bias_variance_tradeoff.png"
      },
      "plot_coefficient_shrinkage": {
        "name": "plot_coefficient_shrinkage",
        "signature": "model.plot_coefficient_shrinkage(X, y, alphas=None, display: bool = True)",
        "category": "visualization",
        "source": "linesight/regression/ridge/visualization/plot_coefficient_shrinkage.py",
        "shortDesc": "Plot coefficient paths as alpha increases (Ridge regularization path).",
        "longDesc": "Each line is one feature. All start near OLS solution and shrink toward 0.",
        "parameters": [
          {
            "name": "X",
            "type": "array-like",
            "default": null,
            "required": true,
            "desc": "Input parameter `X`."
          },
          {
            "name": "y",
            "type": "array-like",
            "default": null,
            "required": true,
            "desc": "Input parameter `y`."
          },
          {
            "name": "alphas",
            "type": "any",
            "default": null,
            "required": false,
            "desc": "Input parameter `alphas`."
          },
          {
            "name": "display",
            "type": "bool",
            "default": "True",
            "required": false,
            "desc": "Input parameter `display`."
          }
        ],
        "returns": {
          "type": "matplotlib.figure.Figure",
          "desc": "Output of the plot_coefficient_shrinkage function."
        },
        "raises": [],
        "warns": [],
        "internalSteps": [
          "Execute plot_coefficient_shrinkage processing",
          "Render or return the output"
        ],
        "mathFormula": null,
        "example": "# 3. Plot coefficients shrinking towards zero as alpha increases\nfig = model.plot_coefficient_shrinkage(X, y, alphas=np.logspace(-3, 3, 20), display=False)\nfig.savefig('ridge_shrinkage.png')",
        "outputImage": "assets/outputs/ridge/plot_coefficient_shrinkage.png"
      },
      "plot_constraint_region": {
        "name": "plot_constraint_region",
        "signature": "model.plot_constraint_region(X, y, display: bool = True)",
        "category": "visualization",
        "source": "linesight/regression/ridge/visualization/plot_constraint_region.py",
        "shortDesc": "For 2-feature models: L2 circle + loss contours (fully vectorized).",
        "longDesc": "Shows geometrically WHY Ridge cannot zero coefficients (circle never touches axes).",
        "parameters": [
          {
            "name": "X",
            "type": "array-like",
            "default": null,
            "required": true,
            "desc": "Input parameter `X`."
          },
          {
            "name": "y",
            "type": "array-like",
            "default": null,
            "required": true,
            "desc": "Input parameter `y`."
          },
          {
            "name": "display",
            "type": "bool",
            "default": "True",
            "required": false,
            "desc": "Input parameter `display`."
          }
        ],
        "returns": {
          "type": "matplotlib.figure.Figure",
          "desc": "Output of the plot_constraint_region function."
        },
        "raises": [],
        "warns": [],
        "internalSteps": [
          "Execute plot_constraint_region processing",
          "Render or return the output"
        ],
        "mathFormula": null,
        "example": "# 6. Render L2 circular constraint boundary overlaid on loss contours\nfig = model.plot_constraint_region(X, y, display=False)\nfig.savefig('ridge_constraint.png')",
        "outputImage": "assets/outputs/ridge/plot_constraint_region.png"
      },
      "plot_effective_degrees_of_freedom": {
        "name": "plot_effective_degrees_of_freedom",
        "signature": "model.plot_effective_degrees_of_freedom(X, y, alphas=None, display: bool = True)",
        "category": "visualization",
        "source": "linesight/regression/ridge/visualization/plot_effective_degrees_of_freedom.py",
        "shortDesc": "Plot the model's effective degrees of freedom as alpha varies.",
        "longDesc": "Formula\n-------\nEDF(α) = trace( X(XᵀX + αI)⁻¹Xᵀ )\nThis uses the normal equation form (not gradient descent), which gives\nthe exact analytical answer. The normal equation form of Ridge is:\ntheta = (XᵀX + αI)⁻¹ Xᵀy\nThe hat matrix H = X(XᵀX + αI)⁻¹Xᵀ maps y to fitted values.\nIts trace = sum of its eigenvalues = effective degrees of freedom.\nWhat is drawn\n-------------\nX-axis: alpha (log scale)\nY-axis: EDF\nHorizontal dashed line at p (unregularized model's EDF)\nHorizontal dashed line at 1 (intercept-only model's EDF)\nVertical line at self.alpha (the current model's alpha)",
        "parameters": [
          {
            "name": "X",
            "type": "array-like, shape (n, p)",
            "default": null,
            "required": true,
            "desc": ""
          },
          {
            "name": "y",
            "type": "array-like, shape (n,)",
            "default": null,
            "required": true,
            "desc": ""
          },
          {
            "name": "alphas",
            "type": "list of float, optional",
            "default": null,
            "required": false,
            "desc": "Default: 50 log-spaced values from 1e-4 to 1e4"
          },
          {
            "name": "display",
            "type": "bool, default True",
            "default": "True",
            "required": false,
            "desc": ""
          }
        ],
        "returns": {
          "type": "matplotlib.figure.Figure",
          "desc": "Output of the plot_effective_degrees_of_freedom function."
        },
        "raises": [],
        "warns": [
          {
            "warning": "LineSightDataWarning",
            "condition": "if n < p:",
            "message": "\"n={n} < p={p}: the system is underdetermined. EDF values may be unreliable. Regularization is especially important here.\" "
          }
        ],
        "internalSteps": [
          "Execute plot_effective_degrees_of_freedom processing",
          "Render or return the output"
        ],
        "mathFormula": null,
        "example": "# 4. Plot Ridge effective degrees of freedom (df) vs regularization strength (alpha)\nfig = model.plot_effective_degrees_of_freedom(X, alphas=np.logspace(-3, 3, 20), display=False)\nfig.savefig('effective_df.png')",
        "outputImage": "assets/outputs/ridge/plot_effective_degrees_of_freedom.png"
      },
      "plot_fit": {
        "name": "plot_fit",
        "signature": "model.plot_fit(X, y, display: bool = True)",
        "category": "visualization",
        "source": "linesight/regression/ridge/visualization/plot_fit.py",
        "shortDesc": "Scatter + regression line for single-feature Ridge model.",
        "longDesc": "Scatter + regression line for single-feature Ridge model.",
        "parameters": [
          {
            "name": "X",
            "type": "array-like",
            "default": null,
            "required": true,
            "desc": "Input parameter `X`."
          },
          {
            "name": "y",
            "type": "array-like",
            "default": null,
            "required": true,
            "desc": "Input parameter `y`."
          },
          {
            "name": "display",
            "type": "bool",
            "default": "True",
            "required": false,
            "desc": "Input parameter `display`."
          }
        ],
        "returns": {
          "type": "matplotlib.figure.Figure",
          "desc": "Output of the plot_fit function."
        },
        "raises": [],
        "warns": [],
        "internalSteps": [
          "Execute plot_fit processing",
          "Render or return the output"
        ],
        "mathFormula": null,
        "example": "# Instantiate and train model\nmodel = RidgeRegression()\nmodel.fit(X, y)\n\n# Call method\nmodel.plot_fit(X, y)",
        "outputImage": "assets/outputs/ridge/plot_fit.png"
      },
      "plot_learning_curve": {
        "name": "plot_learning_curve",
        "signature": "model.plot_learning_curve(X, y, cv_splits: int = 5, train_sizes=None, display: bool = True)",
        "category": "visualization",
        "source": "linesight/regression/ridge/visualization/plot_learning_curve.py",
        "shortDesc": "Show how model performance changes as training dataset size grows.",
        "longDesc": "What is drawn\n-------------\n- X-axis: number of training samples used\n- Y-axis: R² score (or accuracy for logistic)\n- Blue line: training score at each dataset size\n- Red line: validation score at each dataset size\nWhat this teaches\n-----------------\n- If training score is high but validation score is low at ALL sizes:\nthe model is overfitting regardless of data size\n- If both scores are low and flat: the model is underfitting — more\ndata won't help, the model type is wrong\n- If validation score is rising and approaching training score as n grows:\ngetting more data WILL help\nAlgorithm\n---------\nFor each train_size in train_sizes:\n1. Take first train_size samples as training set\n2. Use the remaining as validation set\n3. Fit a temporary model on training set\n4. Score on both sets\n5. Repeat cv_splits times with different random subsets, take mean",
        "parameters": [
          {
            "name": "X",
            "type": "array-like",
            "default": null,
            "required": true,
            "desc": ""
          },
          {
            "name": "y",
            "type": "array-like",
            "default": null,
            "required": true,
            "desc": ""
          },
          {
            "name": "cv_splits",
            "type": "int, default 5",
            "default": "5",
            "required": false,
            "desc": "Number of random subsets to average for each train size. Higher = smoother curve but slower."
          },
          {
            "name": "train_sizes",
            "type": "list of int, optional",
            "default": null,
            "required": false,
            "desc": "Default: 10 evenly-spaced sizes from 10% to 90% of dataset."
          },
          {
            "name": "display",
            "type": "bool, default True",
            "default": "True",
            "required": false,
            "desc": ""
          }
        ],
        "returns": {
          "type": "matplotlib.figure.Figure",
          "desc": "Output of the plot_learning_curve function."
        },
        "raises": [],
        "warns": [],
        "internalSteps": [
          "Execute plot_learning_curve processing",
          "Render or return the output"
        ],
        "mathFormula": null,
        "example": "# Instantiate and train model\nmodel = RidgeRegression()\nmodel.fit(X, y)\n\n# Call method\nmodel.plot_learning_curve(X, y)",
        "outputImage": "assets/outputs/ridge/plot_learning_curve.png"
      },
      "plot_loss_curve": {
        "name": "plot_loss_curve",
        "signature": "model.plot_loss_curve(display: bool = True)",
        "category": "visualization",
        "source": "linesight/regression/ridge/visualization/plot_loss_curve.py",
        "shortDesc": "Plot Ridge training loss (MSE + L2 penalty) over epochs.",
        "longDesc": "Plot Ridge training loss (MSE + L2 penalty) over epochs.",
        "parameters": [
          {
            "name": "display",
            "type": "bool",
            "default": "True",
            "required": false,
            "desc": "Input parameter `display`."
          }
        ],
        "returns": {
          "type": "matplotlib.figure.Figure",
          "desc": "Output of the plot_loss_curve function."
        },
        "raises": [],
        "warns": [],
        "internalSteps": [
          "Execute plot_loss_curve processing",
          "Render or return the output"
        ],
        "mathFormula": null,
        "example": "# Instantiate and train model\nmodel = RidgeRegression()\nmodel.fit(X, y)\n\n# Call method\nmodel.plot_loss_curve(X, y)",
        "outputImage": "assets/outputs/ridge/plot_loss_curve.png"
      },
      "plot_residuals": {
        "name": "plot_residuals",
        "signature": "model.plot_residuals(X, y, display: bool = True)",
        "category": "visualization",
        "source": "linesight/regression/linear/visualization/plot_residuals.py",
        "shortDesc": "Plot residuals (actual - predicted) against fitted values.",
        "longDesc": "What is drawn\n-------------\n- X-axis: fitted values (y_hat)\n- Y-axis: residuals (y - y_hat)\n- Horizontal dashed line at y=0 (where a perfect model would sit)\n- Points colored red (positive residual = underprediction)\nand blue (negative residual = overprediction)\nWhat to look for\n----------------\n- Random scatter around zero = good fit, assumptions met\n- Curved pattern = linear model is wrong, try polynomial\n- Funnel shape = heteroscedasticity (variance increases with fitted value)\n- Outliers far from zero = influential data points",
        "parameters": [
          {
            "name": "X",
            "type": "array-like",
            "default": null,
            "required": true,
            "desc": ""
          },
          {
            "name": "y",
            "type": "array-like",
            "default": null,
            "required": true,
            "desc": ""
          },
          {
            "name": "display",
            "type": "bool, default True",
            "default": "True",
            "required": false,
            "desc": ""
          }
        ],
        "returns": {
          "type": "matplotlib.figure.Figure",
          "desc": "Output of the plot_residuals function."
        },
        "raises": [],
        "warns": [],
        "internalSteps": [
          "Execute plot_residuals processing",
          "Render or return the output"
        ],
        "mathFormula": null,
        "example": "# Instantiate and train model\nmodel = RidgeRegression()\nmodel.fit(X, y)\n\n# Call method\nmodel.plot_residuals(X, y)",
        "outputImage": "assets/outputs/ridge/plot_residuals.png"
      }
    }
  },
  "LassoRegression": {
    "conceptTheory": "Lasso Regression adds an L1 penalty to force less important feature weights to exactly zero, performing feature selection.",
    "learningObjective": "Achieve model sparsity and identify the most critical predicting features.",
    "implementationStrategy": "Use Coordinate Descent with a soft-thresholding operator to update weights individually.",
    "visualDiagram_path": "assets/diagrams/lasso_concept.png",
    "outputImage_path": "assets/outputs/lasso/plot_fit.png",
    "unique_functions": {
      "animate_coordinate_descent": {
        "name": "animate_coordinate_descent",
        "signature": "model.animate_coordinate_descent(X, y, interval: int = 100, display: bool = True)",
        "category": "visualization",
        "source": "linesight/regression/lasso/visualization/animate_coordinate_descent.py",
        "shortDesc": "Animate Lasso's coordinate descent: watch ONE COEFFICIENT AT A TIME update.",
        "longDesc": "This is unique to Lasso/ElasticNet. Unlike gradient descent which updates\nALL coefficients simultaneously each step, coordinate descent updates them\none by one in sequence.\nWhat is drawn (for 2-feature models)\n--------------------------------------\n- Left subplot: scatter of X[:,0] vs y with current fit line for feature 0\n- Right subplot: scatter of X[:,1] vs y with current fit line for feature 1\n- The currently-updating feature is highlighted (other grayed out)\n- A bar chart at the bottom shows current coefficient magnitudes\n- Title: \"Epoch 12, updating feature 1 (x₁)\"\nFor >2 features:\n----------------\n- Single plot: bar chart of all coefficient magnitudes, updating each epoch\n- One bar lights up per update step showing which coordinate is being updated\nWhat this teaches\n-----------------\nThe sequential nature of coordinate descent. Students see that only one\ncoefficient changes per update, and that the coefficient can jump to exactly\nzero (soft-thresholding). This is impossible to understand from text alone.",
        "parameters": [
          {
            "name": "X",
            "type": "array-like, shape (n, p)",
            "default": null,
            "required": true,
            "desc": ""
          },
          {
            "name": "y",
            "type": "array-like, shape (n,)",
            "default": null,
            "required": true,
            "desc": ""
          },
          {
            "name": "interval",
            "type": "int, default 100",
            "default": "100",
            "required": false,
            "desc": ""
          },
          {
            "name": "display",
            "type": "bool, default True",
            "default": "True",
            "required": false,
            "desc": "Requires store_history=True (history stores coefficients per epoch)."
          }
        ],
        "returns": {
          "type": "matplotlib.animation.FuncAnimation",
          "desc": "Output of the animate_coordinate_descent function."
        },
        "raises": [],
        "warns": [],
        "internalSteps": [
          "Execute animate_coordinate_descent processing",
          "Render or return the output"
        ],
        "mathFormula": null,
        "example": "# 7. Animate coefficient updates epoch-by-epoch during Coordinate Descent optimization\nanim = model.animate_coordinate_descent(display=False)\nanim.save('coordinate_descent.gif', writer='pillow')",
        "outputImage": "assets/outputs/lasso/animate_coordinate_descent.gif"
      },
      "compare_with_linear": {
        "name": "compare_with_linear",
        "signature": "model.compare_with_linear(X, y, display: bool = True)",
        "category": "core",
        "source": "linesight/regression/lasso/visualization/compare_with_linear.py",
        "shortDesc": "Side-by-side: Lasso vs unregularized OLS.",
        "longDesc": "Side-by-side: Lasso vs unregularized OLS.",
        "parameters": [
          {
            "name": "X",
            "type": "array-like",
            "default": null,
            "required": true,
            "desc": "Input parameter `X`."
          },
          {
            "name": "y",
            "type": "array-like",
            "default": null,
            "required": true,
            "desc": "Input parameter `y`."
          },
          {
            "name": "display",
            "type": "bool",
            "default": "True",
            "required": false,
            "desc": "Input parameter `display`."
          }
        ],
        "returns": {
          "type": "self",
          "desc": "Output of the compare_with_linear function."
        },
        "raises": [],
        "warns": [],
        "internalSteps": [
          "Execute compare_with_linear processing",
          "Render or return the output"
        ],
        "mathFormula": null,
        "example": "# Instantiate and train model\nmodel = LassoRegression()\nmodel.fit(X, y)\n\n# Call method\nmodel.compare_with_linear(X, y)",
        "outputImage": null
      },
      "explain_coefficients": {
        "name": "explain_coefficients",
        "signature": "model.explain_coefficients() -> str",
        "category": "explain",
        "source": "linesight/regression/lasso/explain/explain_coefficients.py",
        "shortDesc": "Method explain_coefficients() of LassoRegression.",
        "longDesc": "Method explain_coefficients() of LassoRegression.",
        "parameters": [],
        "returns": {
          "type": "str",
          "desc": "Output of the explain_coefficients function."
        },
        "raises": [],
        "warns": [],
        "internalSteps": [
          "Execute explain_coefficients processing",
          "Render or return the output"
        ],
        "mathFormula": null,
        "example": "# Instantiate and train model\nmodel = LassoRegression()\nmodel.fit(X, y)\n\n# Call method\nmodel.explain_coefficients()",
        "outputImage": null
      },
      "explain_regularization": {
        "name": "explain_regularization",
        "signature": "model.explain_regularization() -> str",
        "category": "explain",
        "source": "linesight/regression/lasso/explain/explain_regularization.py",
        "shortDesc": "Method explain_regularization() of LassoRegression.",
        "longDesc": "Method explain_regularization() of LassoRegression.",
        "parameters": [],
        "returns": {
          "type": "str",
          "desc": "Output of the explain_regularization function."
        },
        "raises": [],
        "warns": [],
        "internalSteps": [
          "Execute explain_regularization processing",
          "Render or return the output"
        ],
        "mathFormula": null,
        "example": "# 2. Get step-by-step mathematical details of the L1 regularizer\nmodel.explain_regularization()",
        "outputImage": null
      },
      "explain_sparsity": {
        "name": "explain_sparsity",
        "signature": "model.explain_sparsity() -> str",
        "category": "explain",
        "source": "linesight/regression/lasso/explain/explain_sparsity.py",
        "shortDesc": "Print which features were set to zero and which survived Lasso selection.",
        "longDesc": "Print which features were set to zero and which survived Lasso selection.",
        "parameters": [],
        "returns": {
          "type": "str",
          "desc": "Output of the explain_sparsity function."
        },
        "raises": [],
        "warns": [],
        "internalSteps": [
          "Execute explain_sparsity processing",
          "Render or return the output"
        ],
        "mathFormula": null,
        "example": "# Instantiate and train model\nmodel = LassoRegression()\nmodel.fit(X, y)\n\n# Call method\nmodel.explain_sparsity()",
        "outputImage": null
      },
      "fit": {
        "name": "fit",
        "signature": "model.fit(X, y)",
        "category": "core",
        "source": "linesight/regression/lasso/engine/fit.py",
        "shortDesc": "Train Lasso with coordinate descent + soft-thresholding.",
        "longDesc": "Train Lasso with coordinate descent + soft-thresholding.",
        "parameters": [
          {
            "name": "X",
            "type": "array-like",
            "default": null,
            "required": true,
            "desc": "Input parameter `X`."
          },
          {
            "name": "y",
            "type": "array-like",
            "default": null,
            "required": true,
            "desc": "Input parameter `y`."
          }
        ],
        "returns": {
          "type": "self",
          "desc": "Output of the fit function."
        },
        "raises": [],
        "warns": [],
        "internalSteps": [
          "Execute fit processing",
          "Render or return the output"
        ],
        "mathFormula": "Loss J(w, b) = (1/n) * sum((y_pred_i - y_i)^2) + alpha * sum(|w_j|)\nUpdate via Soft Thresholding operator: S(x, alpha)",
        "example": "import numpy as np\nfrom linesight import LassoRegression\n\n# Generate synthetic dataset with 2 features\nX = np.random.randn(50, 2)\ny = 1.5 * X[:, 0] - 2.0 * X[:, 1] + 1.0 + np.random.randn(50) * 0.5\n\n# 1. Initialize and fit Lasso Regression with L1 penalty (alpha=0.05)\nmodel = LassoRegression(alpha=0.05, normalize=True)\nmodel.fit(X, y)",
        "outputImage": null
      },
      "plot_actual_vs_predicted": {
        "name": "plot_actual_vs_predicted",
        "signature": "model.plot_actual_vs_predicted(X, y, display: bool = True)",
        "category": "visualization",
        "source": "linesight/regression/lasso/visualization/plot_actual_vs_predicted.py",
        "shortDesc": "Scatter plot of actual y values vs predicted ŷ values.",
        "longDesc": "What is drawn\n-------------\n- X-axis: actual y values\n- Y-axis: predicted ŷ values\n- Diagonal line y=x (the \"perfect prediction\" line)\n- Each point is one sample\n- Points above the diagonal = model overestimated\n- Points below the diagonal = model underestimated\n- R² shown in corner\nWhy this matters\n----------------\nThis works for ALL regression types regardless of number of features,\nbecause both axes are scalar (y and ŷ). It is the universal fit diagnostic.\nplot_fit() only works for 1-feature models. This one always works.\nA tight cloud around the diagonal = good fit.\nA curved cloud = the relationship is non-linear (try polynomial).\nFunnel shape = heteroscedasticity.",
        "parameters": [
          {
            "name": "X",
            "type": "array-like",
            "default": null,
            "required": true,
            "desc": "Input parameter `X`."
          },
          {
            "name": "y",
            "type": "array-like",
            "default": null,
            "required": true,
            "desc": "Input parameter `y`."
          },
          {
            "name": "display",
            "type": "bool",
            "default": "True",
            "required": false,
            "desc": "Input parameter `display`."
          }
        ],
        "returns": {
          "type": "matplotlib.figure.Figure",
          "desc": "Output of the plot_actual_vs_predicted function."
        },
        "raises": [],
        "warns": [],
        "internalSteps": [
          "Execute plot_actual_vs_predicted processing",
          "Render or return the output"
        ],
        "mathFormula": null,
        "example": "# Instantiate and train model\nmodel = LassoRegression()\nmodel.fit(X, y)\n\n# Call method\nmodel.plot_actual_vs_predicted(X, y)",
        "outputImage": "assets/outputs/lasso/plot_actual_vs_predicted.png"
      },
      "plot_coefficient_shrinkage": {
        "name": "plot_coefficient_shrinkage",
        "signature": "model.plot_coefficient_shrinkage(X, y, alphas=None, display: bool = True)",
        "category": "visualization",
        "source": "linesight/regression/lasso/visualization/plot_coefficient_shrinkage.py",
        "shortDesc": "Lasso regularization path: coefficients hit 0 sharply (unlike Ridge).",
        "longDesc": "Lasso regularization path: coefficients hit 0 sharply (unlike Ridge).",
        "parameters": [
          {
            "name": "X",
            "type": "array-like",
            "default": null,
            "required": true,
            "desc": "Input parameter `X`."
          },
          {
            "name": "y",
            "type": "array-like",
            "default": null,
            "required": true,
            "desc": "Input parameter `y`."
          },
          {
            "name": "alphas",
            "type": "any",
            "default": null,
            "required": false,
            "desc": "Input parameter `alphas`."
          },
          {
            "name": "display",
            "type": "bool",
            "default": "True",
            "required": false,
            "desc": "Input parameter `display`."
          }
        ],
        "returns": {
          "type": "matplotlib.figure.Figure",
          "desc": "Output of the plot_coefficient_shrinkage function."
        },
        "raises": [],
        "warns": [],
        "internalSteps": [
          "Execute plot_coefficient_shrinkage processing",
          "Render or return the output"
        ],
        "mathFormula": null,
        "example": "# 3. Plot coefficients shrinking to exactly zero as alpha increases\nfig = model.plot_coefficient_shrinkage(X, y, alphas=np.logspace(-3, 1, 20), display=False)\nfig.savefig('lasso_shrinkage.png')",
        "outputImage": "assets/outputs/lasso/plot_coefficient_shrinkage.png"
      },
      "plot_constraint_region": {
        "name": "plot_constraint_region",
        "signature": "model.plot_constraint_region(X, y, display: bool = True)",
        "category": "visualization",
        "source": "linesight/regression/lasso/visualization/plot_constraint_region.py",
        "shortDesc": "For 2-feature models: L2 circle + loss contours (fully vectorized).",
        "longDesc": "Shows geometrically WHY Ridge cannot zero coefficients (circle never touches axes).",
        "parameters": [
          {
            "name": "X",
            "type": "array-like",
            "default": null,
            "required": true,
            "desc": "Input parameter `X`."
          },
          {
            "name": "y",
            "type": "array-like",
            "default": null,
            "required": true,
            "desc": "Input parameter `y`."
          },
          {
            "name": "display",
            "type": "bool",
            "default": "True",
            "required": false,
            "desc": "Input parameter `display`."
          }
        ],
        "returns": {
          "type": "matplotlib.figure.Figure",
          "desc": "Output of the plot_constraint_region function."
        },
        "raises": [],
        "warns": [],
        "internalSteps": [
          "Execute plot_constraint_region processing",
          "Render or return the output"
        ],
        "mathFormula": null,
        "example": "# 6. Render L1 diamond constraint boundary overlaid on loss contours\nfig = model.plot_constraint_region(X, y, display=False)\nfig.savefig('lasso_constraint.png')",
        "outputImage": "assets/outputs/lasso/plot_constraint_region.png"
      },
      "plot_feature_elimination": {
        "name": "plot_feature_elimination",
        "signature": "model.plot_feature_elimination(X, y, alphas=None, feature_names=None, display: bool = True)",
        "category": "visualization",
        "source": "linesight/regression/lasso/visualization/plot_feature_elimination.py",
        "shortDesc": "Show which features get eliminated (zeroed) as alpha increases.",
        "longDesc": "Annotates the alpha at which each feature hits zero.",
        "parameters": [
          {
            "name": "X",
            "type": "array-like",
            "default": null,
            "required": true,
            "desc": "Input parameter `X`."
          },
          {
            "name": "y",
            "type": "array-like",
            "default": null,
            "required": true,
            "desc": "Input parameter `y`."
          },
          {
            "name": "alphas",
            "type": "any",
            "default": null,
            "required": false,
            "desc": "Input parameter `alphas`."
          },
          {
            "name": "feature_names",
            "type": "any",
            "default": null,
            "required": false,
            "desc": "Input parameter `feature_names`."
          },
          {
            "name": "display",
            "type": "bool",
            "default": "True",
            "required": false,
            "desc": "Input parameter `display`."
          }
        ],
        "returns": {
          "type": "matplotlib.figure.Figure",
          "desc": "Output of the plot_feature_elimination function."
        },
        "raises": [],
        "warns": [],
        "internalSteps": [
          "Execute plot_feature_elimination processing",
          "Render or return the output"
        ],
        "mathFormula": null,
        "example": "# 4. View when each feature gets completely eliminated (coefficients = 0)\nfig = model.plot_feature_elimination(X, y, alphas=np.logspace(-3, 1, 20), display=False)\nfig.savefig('feature_elimination.png')",
        "outputImage": "assets/outputs/lasso/plot_feature_elimination.png"
      },
      "plot_fit": {
        "name": "plot_fit",
        "signature": "model.plot_fit(X, y, display: bool = True)",
        "category": "visualization",
        "source": "linesight/regression/lasso/visualization/plot_fit.py",
        "shortDesc": "Method plot_fit() of LassoRegression.",
        "longDesc": "Method plot_fit() of LassoRegression.",
        "parameters": [
          {
            "name": "X",
            "type": "array-like",
            "default": null,
            "required": true,
            "desc": "Input parameter `X`."
          },
          {
            "name": "y",
            "type": "array-like",
            "default": null,
            "required": true,
            "desc": "Input parameter `y`."
          },
          {
            "name": "display",
            "type": "bool",
            "default": "True",
            "required": false,
            "desc": "Input parameter `display`."
          }
        ],
        "returns": {
          "type": "matplotlib.figure.Figure",
          "desc": "Output of the plot_fit function."
        },
        "raises": [],
        "warns": [],
        "internalSteps": [
          "Execute plot_fit processing",
          "Render or return the output"
        ],
        "mathFormula": null,
        "example": "# Instantiate and train model\nmodel = LassoRegression()\nmodel.fit(X, y)\n\n# Call method\nmodel.plot_fit(X, y)",
        "outputImage": "assets/outputs/lasso/plot_fit.png"
      },
      "plot_learning_curve": {
        "name": "plot_learning_curve",
        "signature": "model.plot_learning_curve(X, y, cv_splits: int = 5, train_sizes=None, display: bool = True)",
        "category": "visualization",
        "source": "linesight/regression/lasso/visualization/plot_learning_curve.py",
        "shortDesc": "Show how model performance changes as training dataset size grows.",
        "longDesc": "What is drawn\n-------------\n- X-axis: number of training samples used\n- Y-axis: R² score (or accuracy for logistic)\n- Blue line: training score at each dataset size\n- Red line: validation score at each dataset size\nWhat this teaches\n-----------------\n- If training score is high but validation score is low at ALL sizes:\nthe model is overfitting regardless of data size\n- If both scores are low and flat: the model is underfitting — more\ndata won't help, the model type is wrong\n- If validation score is rising and approaching training score as n grows:\ngetting more data WILL help\nAlgorithm\n---------\nFor each train_size in train_sizes:\n1. Take first train_size samples as training set\n2. Use the remaining as validation set\n3. Fit a temporary model on training set\n4. Score on both sets\n5. Repeat cv_splits times with different random subsets, take mean",
        "parameters": [
          {
            "name": "X",
            "type": "array-like",
            "default": null,
            "required": true,
            "desc": ""
          },
          {
            "name": "y",
            "type": "array-like",
            "default": null,
            "required": true,
            "desc": ""
          },
          {
            "name": "cv_splits",
            "type": "int, default 5",
            "default": "5",
            "required": false,
            "desc": "Number of random subsets to average for each train size. Higher = smoother curve but slower."
          },
          {
            "name": "train_sizes",
            "type": "list of int, optional",
            "default": null,
            "required": false,
            "desc": "Default: 10 evenly-spaced sizes from 10% to 90% of dataset."
          },
          {
            "name": "display",
            "type": "bool, default True",
            "default": "True",
            "required": false,
            "desc": ""
          }
        ],
        "returns": {
          "type": "matplotlib.figure.Figure",
          "desc": "Output of the plot_learning_curve function."
        },
        "raises": [],
        "warns": [],
        "internalSteps": [
          "Execute plot_learning_curve processing",
          "Render or return the output"
        ],
        "mathFormula": null,
        "example": "# Instantiate and train model\nmodel = LassoRegression()\nmodel.fit(X, y)\n\n# Call method\nmodel.plot_learning_curve(X, y)",
        "outputImage": "assets/outputs/lasso/plot_learning_curve.png"
      },
      "plot_loss_curve": {
        "name": "plot_loss_curve",
        "signature": "model.plot_loss_curve(display: bool = True)",
        "category": "visualization",
        "source": "linesight/regression/lasso/visualization/plot_loss_curve.py",
        "shortDesc": "Method plot_loss_curve() of LassoRegression.",
        "longDesc": "Method plot_loss_curve() of LassoRegression.",
        "parameters": [
          {
            "name": "display",
            "type": "bool",
            "default": "True",
            "required": false,
            "desc": "Input parameter `display`."
          }
        ],
        "returns": {
          "type": "matplotlib.figure.Figure",
          "desc": "Output of the plot_loss_curve function."
        },
        "raises": [],
        "warns": [],
        "internalSteps": [
          "Execute plot_loss_curve processing",
          "Render or return the output"
        ],
        "mathFormula": null,
        "example": "# Instantiate and train model\nmodel = LassoRegression()\nmodel.fit(X, y)\n\n# Call method\nmodel.plot_loss_curve(X, y)",
        "outputImage": "assets/outputs/lasso/plot_loss_curve.png"
      },
      "plot_residuals": {
        "name": "plot_residuals",
        "signature": "model.plot_residuals(X, y, display: bool = True)",
        "category": "visualization",
        "source": "linesight/regression/linear/visualization/plot_residuals.py",
        "shortDesc": "Plot residuals (actual - predicted) against fitted values.",
        "longDesc": "What is drawn\n-------------\n- X-axis: fitted values (y_hat)\n- Y-axis: residuals (y - y_hat)\n- Horizontal dashed line at y=0 (where a perfect model would sit)\n- Points colored red (positive residual = underprediction)\nand blue (negative residual = overprediction)\nWhat to look for\n----------------\n- Random scatter around zero = good fit, assumptions met\n- Curved pattern = linear model is wrong, try polynomial\n- Funnel shape = heteroscedasticity (variance increases with fitted value)\n- Outliers far from zero = influential data points",
        "parameters": [
          {
            "name": "X",
            "type": "array-like",
            "default": null,
            "required": true,
            "desc": ""
          },
          {
            "name": "y",
            "type": "array-like",
            "default": null,
            "required": true,
            "desc": ""
          },
          {
            "name": "display",
            "type": "bool, default True",
            "default": "True",
            "required": false,
            "desc": ""
          }
        ],
        "returns": {
          "type": "matplotlib.figure.Figure",
          "desc": "Output of the plot_residuals function."
        },
        "raises": [],
        "warns": [],
        "internalSteps": [
          "Execute plot_residuals processing",
          "Render or return the output"
        ],
        "mathFormula": null,
        "example": "# Instantiate and train model\nmodel = LassoRegression()\nmodel.fit(X, y)\n\n# Call method\nmodel.plot_residuals(X, y)",
        "outputImage": "assets/outputs/lasso/plot_residuals.png"
      },
      "plot_sparsity_path": {
        "name": "plot_sparsity_path",
        "signature": "model.plot_sparsity_path(X, y, alphas=None, display: bool = True)",
        "category": "visualization",
        "source": "linesight/regression/lasso/visualization/plot_sparsity_path.py",
        "shortDesc": "Plot the number of nonzero features as alpha increases.",
        "longDesc": "Shows Lasso's feature selection behavior as a step function:\neach step-down = one more feature eliminated.\nWhat is drawn\n-------------\nX-axis: alpha (log scale)\nY-axis: number of features with |coefficient| > 1e-6 (nonzero)\nStep-function line showing how many features survive at each alpha\nVertical dashed line at current self.alpha\nAnnotations: which feature is eliminated at each step",
        "parameters": [
          {
            "name": "X",
            "type": "array-like",
            "default": null,
            "required": true,
            "desc": ""
          },
          {
            "name": "y",
            "type": "array-like",
            "default": null,
            "required": true,
            "desc": ""
          },
          {
            "name": "alphas",
            "type": "list of float, optional",
            "default": null,
            "required": false,
            "desc": "Default: 60 log-spaced values from 1e-4 to 1e1"
          },
          {
            "name": "display",
            "type": "bool, default True",
            "default": "True",
            "required": false,
            "desc": ""
          }
        ],
        "returns": {
          "type": "matplotlib.figure.Figure",
          "desc": "Output of the plot_sparsity_path function."
        },
        "raises": [],
        "warns": [],
        "internalSteps": [
          "Execute plot_sparsity_path processing",
          "Render or return the output"
        ],
        "mathFormula": null,
        "example": "# 5. Graph the number of non-zero parameters vs alpha\nfig = model.plot_sparsity_path(X, y, alphas=np.logspace(-3, 1, 20), display=False)\nfig.savefig('sparsity_path.png')",
        "outputImage": "assets/outputs/lasso/plot_sparsity_path.png"
      }
    }
  },
  "ElasticNetRegression": {
    "conceptTheory": "ElasticNet blends both L1 and L2 regularization penalties, controlled by the l1_ratio parameter.",
    "learningObjective": "Balance sparsity (L1) and coefficient shrinkage (L2) to handle highly correlated feature groups.",
    "implementationStrategy": "Solve using Coordinate Descent with a mixed soft-thresholding and scaling update loop.",
    "visualDiagram_path": "assets/diagrams/elasticnet_concept.png",
    "outputImage_path": "assets/outputs/elasticnet/plot_fit.png",
    "unique_functions": {
      "animate_l1_ratio_sweep": {
        "name": "animate_l1_ratio_sweep",
        "signature": "model.animate_l1_ratio_sweep(X, y, n_frames: int = 40, interval: int = 150, display: bool = True)",
        "category": "visualization",
        "source": "linesight/regression/elasticnet/visualization/animate_l1_ratio_sweep.py",
        "shortDesc": "Animate coefficient changes as l1_ratio sweeps from 0.0 to 1.0.",
        "longDesc": "Each frame fits an ElasticNet model with a different l1_ratio and\nshows the resulting coefficient bar chart.\nWhat is drawn\n-------------\nBar chart of coefficient magnitudes. Each frame:\n- Title: \"l1_ratio = 0.25 — Ridge-dominant\" or \"l1_ratio = 0.75 — Lasso-dominant\"\n- Bar color interpolates from green (Ridge) to red (Lasso)\n- Gray bars = zeroed coefficients\n- Subtitle: count of zeroed features",
        "parameters": [
          {
            "name": "X",
            "type": "array-like",
            "default": null,
            "required": true,
            "desc": ""
          },
          {
            "name": "y",
            "type": "array-like",
            "default": null,
            "required": true,
            "desc": ""
          },
          {
            "name": "n_frames",
            "type": "int, default 40",
            "default": "40",
            "required": false,
            "desc": "Number of l1_ratio values to animate (evenly spaced 0 to 1)."
          },
          {
            "name": "interval",
            "type": "int, default 150",
            "default": "150",
            "required": false,
            "desc": ""
          },
          {
            "name": "display",
            "type": "bool, default True",
            "default": "True",
            "required": false,
            "desc": ""
          }
        ],
        "returns": {
          "type": "matplotlib.animation.FuncAnimation",
          "desc": "Output of the animate_l1_ratio_sweep function."
        },
        "raises": [],
        "warns": [],
        "internalSteps": [
          "Execute animate_l1_ratio_sweep processing",
          "Render or return the output"
        ],
        "mathFormula": null,
        "example": "# 5. Animate coefficient magnitudes shifting as l1_ratio sweeps from 0 to 1\nanim = model.animate_l1_ratio_sweep(X, y, n_frames=20, display=False)\nanim.save('l1_ratio_sweep.gif', writer='pillow')",
        "outputImage": "assets/outputs/elasticnet/animate_l1_ratio_sweep.gif"
      },
      "compare_regularization_methods": {
        "name": "compare_regularization_methods",
        "signature": "model.compare_regularization_methods(X, y, alpha=None, display: bool = True)",
        "category": "core",
        "source": "linesight/regression/elasticnet/visualization/compare_regularization_methods.py",
        "shortDesc": "Fit four models on the same data and compare coefficient magnitudes side by side.",
        "longDesc": "Models compared: LinearRegression, Ridge, Lasso, ElasticNet (same alpha).\nWhat is drawn\n-------------\n2×2 subplot grid. Each subplot is a bar chart of coefficient values for\none model. All four use the same Y-axis scale so magnitudes are comparable.\nThe visual tells the story:\n- Linear: largest coefficients (no shrinkage)\n- Ridge: all coefficients smaller, none are zero\n- Lasso: some coefficients exactly zero (sparse)\n- ElasticNet: mix of both behaviors",
        "parameters": [
          {
            "name": "X",
            "type": "array-like",
            "default": null,
            "required": true,
            "desc": ""
          },
          {
            "name": "y",
            "type": "array-like",
            "default": null,
            "required": true,
            "desc": ""
          },
          {
            "name": "alpha",
            "type": "float, optional",
            "default": null,
            "required": false,
            "desc": "Regularization strength. Defaults to self.alpha."
          },
          {
            "name": "display",
            "type": "bool, default True",
            "default": "True",
            "required": false,
            "desc": ""
          }
        ],
        "returns": {
          "type": "self",
          "desc": "Output of the compare_regularization_methods function."
        },
        "raises": [],
        "warns": [],
        "internalSteps": [
          "Execute compare_regularization_methods processing",
          "Render or return the output"
        ],
        "mathFormula": null,
        "example": "# Instantiate and train model\nmodel = ElasticNetRegression()\nmodel.fit(X, y)\n\n# Call method\nmodel.compare_regularization_methods(X, y)",
        "outputImage": null
      },
      "explain_coefficients": {
        "name": "explain_coefficients",
        "signature": "model.explain_coefficients() -> str",
        "category": "explain",
        "source": "linesight/regression/elasticnet/explain/explain_coefficients.py",
        "shortDesc": "Method explain_coefficients() of ElasticNetRegression.",
        "longDesc": "Method explain_coefficients() of ElasticNetRegression.",
        "parameters": [],
        "returns": {
          "type": "str",
          "desc": "Output of the explain_coefficients function."
        },
        "raises": [],
        "warns": [],
        "internalSteps": [
          "Execute explain_coefficients processing",
          "Render or return the output"
        ],
        "mathFormula": null,
        "example": "# Instantiate and train model\nmodel = ElasticNetRegression()\nmodel.fit(X, y)\n\n# Call method\nmodel.explain_coefficients()",
        "outputImage": null
      },
      "explain_regularization": {
        "name": "explain_regularization",
        "signature": "model.explain_regularization() -> str",
        "category": "explain",
        "source": "linesight/regression/elasticnet/explain/explain_regularization.py",
        "shortDesc": "Explain ElasticNet L1/L2 balance.",
        "longDesc": "Explain ElasticNet L1/L2 balance.",
        "parameters": [],
        "returns": {
          "type": "str",
          "desc": "Output of the explain_regularization function."
        },
        "raises": [],
        "warns": [],
        "internalSteps": [
          "Execute explain_regularization processing",
          "Render or return the output"
        ],
        "mathFormula": null,
        "example": "# 2. Get step-by-step mathematical details of the combined L1+L2 regularizer\nmodel.explain_regularization()",
        "outputImage": null
      },
      "fit": {
        "name": "fit",
        "signature": "model.fit(X, y)",
        "category": "core",
        "source": "linesight/regression/elasticnet/engine/fit.py",
        "shortDesc": "Train ElasticNet with coordinate descent: L1 (sparsity) + L2 (shrinkage).",
        "longDesc": "Train ElasticNet with coordinate descent: L1 (sparsity) + L2 (shrinkage).",
        "parameters": [
          {
            "name": "X",
            "type": "array-like",
            "default": null,
            "required": true,
            "desc": "Input parameter `X`."
          },
          {
            "name": "y",
            "type": "array-like",
            "default": null,
            "required": true,
            "desc": "Input parameter `y`."
          }
        ],
        "returns": {
          "type": "self",
          "desc": "Output of the fit function."
        },
        "raises": [],
        "warns": [],
        "internalSteps": [
          "Execute fit processing",
          "Render or return the output"
        ],
        "mathFormula": "Loss J(w, b) = (1/n) * sum((y_pred_i - y_i)^2) + alpha * l1_ratio * sum(|w_j|) + 0.5 * alpha * (1 - l1_ratio) * sum(w_j^2)",
        "example": "import numpy as np\nfrom linesight import ElasticNetRegression\n\n# Generate synthetic dataset with 2 features\nX = np.random.randn(50, 2)\ny = 1.5 * X[:, 0] - 2.0 * X[:, 1] + 1.0 + np.random.randn(50) * 0.5\n\n# 1. Initialize and fit ElasticNet Regression (L1/L2 blend)\nmodel = ElasticNetRegression(alpha=0.05, l1_ratio=0.5, normalize=True)\nmodel.fit(X, y)",
        "outputImage": null
      },
      "plot_actual_vs_predicted": {
        "name": "plot_actual_vs_predicted",
        "signature": "model.plot_actual_vs_predicted(X, y, display: bool = True)",
        "category": "visualization",
        "source": "linesight/regression/elasticnet/visualization/plot_actual_vs_predicted.py",
        "shortDesc": "Scatter plot of actual y values vs predicted ŷ values.",
        "longDesc": "What is drawn\n-------------\n- X-axis: actual y values\n- Y-axis: predicted ŷ values\n- Diagonal line y=x (the \"perfect prediction\" line)\n- Each point is one sample\n- Points above the diagonal = model overestimated\n- Points below the diagonal = model underestimated\n- R² shown in corner\nWhy this matters\n----------------\nThis works for ALL regression types regardless of number of features,\nbecause both axes are scalar (y and ŷ). It is the universal fit diagnostic.\nplot_fit() only works for 1-feature models. This one always works.\nA tight cloud around the diagonal = good fit.\nA curved cloud = the relationship is non-linear (try polynomial).\nFunnel shape = heteroscedasticity.",
        "parameters": [
          {
            "name": "X",
            "type": "array-like",
            "default": null,
            "required": true,
            "desc": "Input parameter `X`."
          },
          {
            "name": "y",
            "type": "array-like",
            "default": null,
            "required": true,
            "desc": "Input parameter `y`."
          },
          {
            "name": "display",
            "type": "bool",
            "default": "True",
            "required": false,
            "desc": "Input parameter `display`."
          }
        ],
        "returns": {
          "type": "matplotlib.figure.Figure",
          "desc": "Output of the plot_actual_vs_predicted function."
        },
        "raises": [],
        "warns": [],
        "internalSteps": [
          "Execute plot_actual_vs_predicted processing",
          "Render or return the output"
        ],
        "mathFormula": null,
        "example": "# Instantiate and train model\nmodel = ElasticNetRegression()\nmodel.fit(X, y)\n\n# Call method\nmodel.plot_actual_vs_predicted(X, y)",
        "outputImage": "assets/outputs/elasticnet/plot_actual_vs_predicted.png"
      },
      "plot_coefficient_shrinkage": {
        "name": "plot_coefficient_shrinkage",
        "signature": "model.plot_coefficient_shrinkage(X, y, alphas=None, display: bool = True)",
        "category": "visualization",
        "source": "linesight/regression/elasticnet/visualization/plot_coefficient_shrinkage.py",
        "shortDesc": "ElasticNet regularization path.",
        "longDesc": "ElasticNet regularization path.",
        "parameters": [
          {
            "name": "X",
            "type": "array-like",
            "default": null,
            "required": true,
            "desc": "Input parameter `X`."
          },
          {
            "name": "y",
            "type": "array-like",
            "default": null,
            "required": true,
            "desc": "Input parameter `y`."
          },
          {
            "name": "alphas",
            "type": "any",
            "default": null,
            "required": false,
            "desc": "Input parameter `alphas`."
          },
          {
            "name": "display",
            "type": "bool",
            "default": "True",
            "required": false,
            "desc": "Input parameter `display`."
          }
        ],
        "returns": {
          "type": "matplotlib.figure.Figure",
          "desc": "Output of the plot_coefficient_shrinkage function."
        },
        "raises": [],
        "warns": [],
        "internalSteps": [
          "Execute plot_coefficient_shrinkage processing",
          "Render or return the output"
        ],
        "mathFormula": null,
        "example": "# 3. Plot coefficient paths as overall alpha increases\nfig = model.plot_coefficient_shrinkage(X, y, alphas=np.logspace(-3, 1, 20), display=False)\nfig.savefig('elasticnet_shrinkage.png')",
        "outputImage": "assets/outputs/elasticnet/plot_coefficient_shrinkage.png"
      },
      "plot_fit": {
        "name": "plot_fit",
        "signature": "model.plot_fit(X, y, display: bool = True)",
        "category": "visualization",
        "source": "linesight/regression/elasticnet/visualization/plot_fit.py",
        "shortDesc": "Method plot_fit() of ElasticNetRegression.",
        "longDesc": "Method plot_fit() of ElasticNetRegression.",
        "parameters": [
          {
            "name": "X",
            "type": "array-like",
            "default": null,
            "required": true,
            "desc": "Input parameter `X`."
          },
          {
            "name": "y",
            "type": "array-like",
            "default": null,
            "required": true,
            "desc": "Input parameter `y`."
          },
          {
            "name": "display",
            "type": "bool",
            "default": "True",
            "required": false,
            "desc": "Input parameter `display`."
          }
        ],
        "returns": {
          "type": "matplotlib.figure.Figure",
          "desc": "Output of the plot_fit function."
        },
        "raises": [],
        "warns": [],
        "internalSteps": [
          "Execute plot_fit processing",
          "Render or return the output"
        ],
        "mathFormula": null,
        "example": "# Instantiate and train model\nmodel = ElasticNetRegression()\nmodel.fit(X, y)\n\n# Call method\nmodel.plot_fit(X, y)",
        "outputImage": "assets/outputs/elasticnet/plot_fit.png"
      },
      "plot_l1_l2_balance": {
        "name": "plot_l1_l2_balance",
        "signature": "model.plot_l1_l2_balance(X, y, l1_ratios=None, display: bool = True)",
        "category": "visualization",
        "source": "linesight/regression/elasticnet/visualization/plot_l1_l2_balance.py",
        "shortDesc": "Show how coefficient behavior changes as l1_ratio shifts from Ridge to Lasso.",
        "longDesc": "l1_ratio=0.0 is pure Ridge: all coefficients shrink, none zero.\nl1_ratio=1.0 is pure Lasso: some coefficients become exactly zero.\nl1_ratio=0.5 is ElasticNet: mix.\nWhat is drawn\n-------------\nOne subplot per l1_ratio value showing coefficient bar chart.\nZeroed coefficients shown in gray. Non-zero in purple.\nTitle shows the interpolation: \"l1_ratio=0.0 (Ridge)\" ... \"l1_ratio=1.0 (Lasso)\"",
        "parameters": [
          {
            "name": "X",
            "type": "array-like",
            "default": null,
            "required": true,
            "desc": ""
          },
          {
            "name": "y",
            "type": "array-like",
            "default": null,
            "required": true,
            "desc": ""
          },
          {
            "name": "l1_ratios",
            "type": "list of float, optional",
            "default": null,
            "required": false,
            "desc": "Default: [0.0, 0.2, 0.5, 0.8, 1.0]"
          },
          {
            "name": "display",
            "type": "bool, default True",
            "default": "True",
            "required": false,
            "desc": ""
          }
        ],
        "returns": {
          "type": "matplotlib.figure.Figure",
          "desc": "Output of the plot_l1_l2_balance function."
        },
        "raises": [],
        "warns": [],
        "internalSteps": [
          "Execute plot_l1_l2_balance processing",
          "Render or return the output"
        ],
        "mathFormula": null,
        "example": "# 4. Compare feature coefficients across different l1_ratios\nfig = model.plot_l1_l2_balance(X, y, l1_ratios=[0.1, 0.3, 0.5, 0.7, 0.9], display=False)\nfig.savefig('l1_l2_balance.png')",
        "outputImage": "assets/outputs/elasticnet/plot_l1_l2_balance.png"
      },
      "plot_learning_curve": {
        "name": "plot_learning_curve",
        "signature": "model.plot_learning_curve(X, y, cv_splits: int = 5, train_sizes=None, display: bool = True)",
        "category": "visualization",
        "source": "linesight/regression/elasticnet/visualization/plot_learning_curve.py",
        "shortDesc": "Show how model performance changes as training dataset size grows.",
        "longDesc": "What is drawn\n-------------\n- X-axis: number of training samples used\n- Y-axis: R² score (or accuracy for logistic)\n- Blue line: training score at each dataset size\n- Red line: validation score at each dataset size\nWhat this teaches\n-----------------\n- If training score is high but validation score is low at ALL sizes:\nthe model is overfitting regardless of data size\n- If both scores are low and flat: the model is underfitting — more\ndata won't help, the model type is wrong\n- If validation score is rising and approaching training score as n grows:\ngetting more data WILL help\nAlgorithm\n---------\nFor each train_size in train_sizes:\n1. Take first train_size samples as training set\n2. Use the remaining as validation set\n3. Fit a temporary model on training set\n4. Score on both sets\n5. Repeat cv_splits times with different random subsets, take mean",
        "parameters": [
          {
            "name": "X",
            "type": "array-like",
            "default": null,
            "required": true,
            "desc": ""
          },
          {
            "name": "y",
            "type": "array-like",
            "default": null,
            "required": true,
            "desc": ""
          },
          {
            "name": "cv_splits",
            "type": "int, default 5",
            "default": "5",
            "required": false,
            "desc": "Number of random subsets to average for each train size. Higher = smoother curve but slower."
          },
          {
            "name": "train_sizes",
            "type": "list of int, optional",
            "default": null,
            "required": false,
            "desc": "Default: 10 evenly-spaced sizes from 10% to 90% of dataset."
          },
          {
            "name": "display",
            "type": "bool, default True",
            "default": "True",
            "required": false,
            "desc": ""
          }
        ],
        "returns": {
          "type": "matplotlib.figure.Figure",
          "desc": "Output of the plot_learning_curve function."
        },
        "raises": [],
        "warns": [],
        "internalSteps": [
          "Execute plot_learning_curve processing",
          "Render or return the output"
        ],
        "mathFormula": null,
        "example": "# Instantiate and train model\nmodel = ElasticNetRegression()\nmodel.fit(X, y)\n\n# Call method\nmodel.plot_learning_curve(X, y)",
        "outputImage": "assets/outputs/elasticnet/plot_learning_curve.png"
      },
      "plot_loss_curve": {
        "name": "plot_loss_curve",
        "signature": "model.plot_loss_curve(display: bool = True)",
        "category": "visualization",
        "source": "linesight/regression/elasticnet/visualization/plot_loss_curve.py",
        "shortDesc": "Method plot_loss_curve() of ElasticNetRegression.",
        "longDesc": "Method plot_loss_curve() of ElasticNetRegression.",
        "parameters": [
          {
            "name": "display",
            "type": "bool",
            "default": "True",
            "required": false,
            "desc": "Input parameter `display`."
          }
        ],
        "returns": {
          "type": "matplotlib.figure.Figure",
          "desc": "Output of the plot_loss_curve function."
        },
        "raises": [],
        "warns": [],
        "internalSteps": [
          "Execute plot_loss_curve processing",
          "Render or return the output"
        ],
        "mathFormula": null,
        "example": "# Instantiate and train model\nmodel = ElasticNetRegression()\nmodel.fit(X, y)\n\n# Call method\nmodel.plot_loss_curve(X, y)",
        "outputImage": "assets/outputs/elasticnet/plot_loss_curve.png"
      },
      "plot_residuals": {
        "name": "plot_residuals",
        "signature": "model.plot_residuals(X, y, display: bool = True)",
        "category": "visualization",
        "source": "linesight/regression/linear/visualization/plot_residuals.py",
        "shortDesc": "Plot residuals (actual - predicted) against fitted values.",
        "longDesc": "What is drawn\n-------------\n- X-axis: fitted values (y_hat)\n- Y-axis: residuals (y - y_hat)\n- Horizontal dashed line at y=0 (where a perfect model would sit)\n- Points colored red (positive residual = underprediction)\nand blue (negative residual = overprediction)\nWhat to look for\n----------------\n- Random scatter around zero = good fit, assumptions met\n- Curved pattern = linear model is wrong, try polynomial\n- Funnel shape = heteroscedasticity (variance increases with fitted value)\n- Outliers far from zero = influential data points",
        "parameters": [
          {
            "name": "X",
            "type": "array-like",
            "default": null,
            "required": true,
            "desc": ""
          },
          {
            "name": "y",
            "type": "array-like",
            "default": null,
            "required": true,
            "desc": ""
          },
          {
            "name": "display",
            "type": "bool, default True",
            "default": "True",
            "required": false,
            "desc": ""
          }
        ],
        "returns": {
          "type": "matplotlib.figure.Figure",
          "desc": "Output of the plot_residuals function."
        },
        "raises": [],
        "warns": [],
        "internalSteps": [
          "Execute plot_residuals processing",
          "Render or return the output"
        ],
        "mathFormula": null,
        "example": "# Instantiate and train model\nmodel = ElasticNetRegression()\nmodel.fit(X, y)\n\n# Call method\nmodel.plot_residuals(X, y)",
        "outputImage": "assets/outputs/elasticnet/plot_residuals.png"
      }
    }
  },
  "LogisticRegression": {
    "conceptTheory": "Logistic Regression models binary probabilities using a sigmoid function, mapping inputs to [0, 1].",
    "learningObjective": "Find a decision boundary that separates classes by minimizing Binary Cross-Entropy loss.",
    "implementationStrategy": "Apply Gradient Descent to weights and bias with sigmoid probability mapping.",
    "visualDiagram_path": "assets/diagrams/logistic_concept.png",
    "outputImage_path": "assets/outputs/logistic/plot_fit.png",
    "unique_functions": {
      "animate_boundary": {
        "name": "animate_boundary",
        "signature": "model.animate_boundary(X, y, step: int = 10, display: bool = True)",
        "category": "visualization",
        "source": "linesight/regression/logistic/visualization/animate_boundary.py",
        "shortDesc": "Animate decision boundary movement over training epochs.",
        "longDesc": "Animate decision boundary movement over training epochs.",
        "parameters": [
          {
            "name": "X",
            "type": "array-like",
            "default": null,
            "required": true,
            "desc": "Input parameter `X`."
          },
          {
            "name": "y",
            "type": "array-like",
            "default": null,
            "required": true,
            "desc": "Input parameter `y`."
          },
          {
            "name": "step",
            "type": "int, default 10  — record every step-th epoch (controls memory)",
            "default": "10",
            "required": false,
            "desc": ""
          },
          {
            "name": "display",
            "type": "bool, default True",
            "default": "True",
            "required": false,
            "desc": ""
          }
        ],
        "returns": {
          "type": "matplotlib.animation.FuncAnimation",
          "desc": "Output of the animate_boundary function."
        },
        "raises": [],
        "warns": [],
        "internalSteps": [
          "Execute animate_boundary processing",
          "Render or return the output"
        ],
        "mathFormula": null,
        "example": "# 11. Animate decision boundary shifting during optimization epochs\nanim = model.animate_boundary(X, y, step=10, display=False)\nanim.save('boundary_animation.gif', writer='pillow')",
        "outputImage": "assets/outputs/logistic/animate_boundary.gif"
      },
      "explain_boundary": {
        "name": "explain_boundary",
        "signature": "model.explain_boundary() -> str",
        "category": "explain",
        "source": "linesight/regression/logistic/explain/explain_boundary.py",
        "shortDesc": "Method explain_boundary() of LogisticRegression.",
        "longDesc": "Method explain_boundary() of LogisticRegression.",
        "parameters": [],
        "returns": {
          "type": "str",
          "desc": "Output of the explain_boundary function."
        },
        "raises": [],
        "warns": [],
        "internalSteps": [
          "Execute explain_boundary processing",
          "Render or return the output"
        ],
        "mathFormula": null,
        "example": "# 2. Extract decision boundary equation coefficients\nmodel.explain_boundary()",
        "outputImage": null
      },
      "explain_coefficients": {
        "name": "explain_coefficients",
        "signature": "model.explain_coefficients() -> str",
        "category": "explain",
        "source": "linesight/regression/logistic/explain/explain_coefficients.py",
        "shortDesc": "Method explain_coefficients() of LogisticRegression.",
        "longDesc": "Method explain_coefficients() of LogisticRegression.",
        "parameters": [],
        "returns": {
          "type": "str",
          "desc": "Output of the explain_coefficients function."
        },
        "raises": [],
        "warns": [],
        "internalSteps": [
          "Execute explain_coefficients processing",
          "Render or return the output"
        ],
        "mathFormula": null,
        "example": "# Instantiate and train model\nmodel = LogisticRegression()\nmodel.fit(X, y)\n\n# Call method\nmodel.explain_coefficients()",
        "outputImage": null
      },
      "explain_sigmoid": {
        "name": "explain_sigmoid",
        "signature": "model.explain_sigmoid() -> str",
        "category": "explain",
        "source": "linesight/regression/logistic/explain/explain_sigmoid.py",
        "shortDesc": "Method explain_sigmoid() of LogisticRegression.",
        "longDesc": "Method explain_sigmoid() of LogisticRegression.",
        "parameters": [],
        "returns": {
          "type": "str",
          "desc": "Output of the explain_sigmoid function."
        },
        "raises": [],
        "warns": [],
        "internalSteps": [
          "Execute explain_sigmoid processing",
          "Render or return the output"
        ],
        "mathFormula": null,
        "example": "# Instantiate and train model\nmodel = LogisticRegression()\nmodel.fit(X, y)\n\n# Call method\nmodel.explain_sigmoid()",
        "outputImage": null
      },
      "fit": {
        "name": "fit",
        "signature": "model.fit(X, y)",
        "category": "core",
        "source": "linesight/regression/logistic/engine/fit.py",
        "shortDesc": "Train logistic regression (binary classification) using cross-entropy loss.",
        "longDesc": "If normalize=True (default False), standardizes each feature to\nmean=0 / std=1 before training. Prevents gradient explosion on\nmixed-scale features. Predictions are automatically un-scaled.",
        "parameters": [
          {
            "name": "X",
            "type": "array-like",
            "default": null,
            "required": true,
            "desc": "Input parameter `X`."
          },
          {
            "name": "y",
            "type": "array-like",
            "default": null,
            "required": true,
            "desc": "Input parameter `y`."
          }
        ],
        "returns": {
          "type": "self",
          "desc": "Output of the fit function."
        },
        "raises": [],
        "warns": [],
        "internalSteps": [
          "Execute fit processing",
          "Render or return the output"
        ],
        "mathFormula": "Loss J(w, b) = -(1/n) * sum(y_i * log(p_i) + (1 - y_i) * log(1 - p_i))\nwhere p_i = 1 / (1 + exp(-(w * x_i + b)))",
        "example": "import numpy as np\nfrom linesight import LogisticRegression\n\n# Generate binary classification dataset (2 features)\nX = np.random.randn(80, 2)\ny = (X[:, 0] + X[:, 1] > 0.1).astype(int)\n\n# 1. Initialize and fit the Logistic Regression classification model\nmodel = LogisticRegression(learning_rate=0.1, store_history=True)\nmodel.fit(X, y)",
        "outputImage": null
      },
      "plot_actual_vs_predicted": {
        "name": "plot_actual_vs_predicted",
        "signature": "model.plot_actual_vs_predicted(X, y, display: bool = True)",
        "category": "visualization",
        "source": "linesight/regression/logistic/visualization/plot_actual_vs_predicted.py",
        "shortDesc": "Scatter plot of actual y values vs predicted ŷ values.",
        "longDesc": "What is drawn\n-------------\n- X-axis: actual y values\n- Y-axis: predicted ŷ values\n- Diagonal line y=x (the \"perfect prediction\" line)\n- Each point is one sample\n- Points above the diagonal = model overestimated\n- Points below the diagonal = model underestimated\n- R² shown in corner\nWhy this matters\n----------------\nThis works for ALL regression types regardless of number of features,\nbecause both axes are scalar (y and ŷ). It is the universal fit diagnostic.\nplot_fit() only works for 1-feature models. This one always works.\nA tight cloud around the diagonal = good fit.\nA curved cloud = the relationship is non-linear (try polynomial).\nFunnel shape = heteroscedasticity.",
        "parameters": [
          {
            "name": "X",
            "type": "array-like",
            "default": null,
            "required": true,
            "desc": "Input parameter `X`."
          },
          {
            "name": "y",
            "type": "array-like",
            "default": null,
            "required": true,
            "desc": "Input parameter `y`."
          },
          {
            "name": "display",
            "type": "bool",
            "default": "True",
            "required": false,
            "desc": "Input parameter `display`."
          }
        ],
        "returns": {
          "type": "matplotlib.figure.Figure",
          "desc": "Output of the plot_actual_vs_predicted function."
        },
        "raises": [],
        "warns": [],
        "internalSteps": [
          "Execute plot_actual_vs_predicted processing",
          "Render or return the output"
        ],
        "mathFormula": null,
        "example": "# Instantiate and train model\nmodel = LogisticRegression()\nmodel.fit(X, y)\n\n# Call method\nmodel.plot_actual_vs_predicted(X, y)",
        "outputImage": "assets/outputs/logistic/plot_actual_vs_predicted.png"
      },
      "plot_calibration_curve": {
        "name": "plot_calibration_curve",
        "signature": "model.plot_calibration_curve(X, y, n_bins: int = 10, display: bool = True)",
        "category": "visualization",
        "source": "linesight/regression/logistic/visualization/plot_calibration_curve.py",
        "shortDesc": "Plot a reliability diagram: predicted probability vs actual positive rate.",
        "longDesc": "Algorithm\n---------\n1. Get predicted probabilities from predict_proba(X)\n2. Bin samples into n_bins equal-width bins by predicted probability\n(bin 1: p=0.0–0.1, bin 2: p=0.1–0.2, ..., bin 10: p=0.9–1.0)\n3. For each bin: compute mean predicted probability and mean actual y\n4. Plot mean predicted (x-axis) vs mean actual (y-axis)\nPerfect calibration: all points on the diagonal (y=x)\nOverconfident model: points below the diagonal\nUnderconfident model: points above the diagonal\nWhat is drawn\n-------------\n- Diagonal dashed line (perfect calibration)\n- Blue line + dots: actual calibration curve\n- Bar chart at the bottom: sample count per bin\n(thin bins = fewer samples = less reliable estimate)",
        "parameters": [
          {
            "name": "X",
            "type": "array-like",
            "default": null,
            "required": true,
            "desc": ""
          },
          {
            "name": "y",
            "type": "array-like",
            "default": null,
            "required": true,
            "desc": ""
          },
          {
            "name": "n_bins",
            "type": "int, default 10",
            "default": "10",
            "required": false,
            "desc": "Number of probability bins."
          },
          {
            "name": "display",
            "type": "bool, default True",
            "default": "True",
            "required": false,
            "desc": ""
          }
        ],
        "returns": {
          "type": "matplotlib.figure.Figure",
          "desc": "Output of the plot_calibration_curve function."
        },
        "raises": [
          {
            "exception": "LineSightShapeError",
            "condition": "",
            "message": "If n_bins > 20 or n_bins < 3: \"n_bins must be between 3 and 20. Received {n}. Too few bins loses resolution. Too many bins has sparse counts.\" "
          }
        ],
        "warns": [
          {
            "warning": "LineSightDataWarning",
            "condition": "if any bin has fewer than 5 samples:",
            "message": "\"Bin [{low}, {high}] has only {count} samples. Calibration estimate for this bin is unreliable.\" "
          }
        ],
        "internalSteps": [
          "Execute plot_calibration_curve processing",
          "Render or return the output"
        ],
        "mathFormula": null,
        "example": "# 8. Plot predicted probabilities against true class fractions to check calibration\nfig = model.plot_calibration_curve(X, y, display=False)\nfig.savefig('calibration.png')",
        "outputImage": "assets/outputs/logistic/plot_calibration_curve.png"
      },
      "plot_confusion_matrix": {
        "name": "plot_confusion_matrix",
        "signature": "model.plot_confusion_matrix(X, y, display: bool = True)",
        "category": "visualization",
        "source": "linesight/regression/logistic/visualization/plot_confusion_matrix.py",
        "shortDesc": "Plot a color-coded confusion matrix for classification results.",
        "longDesc": "Layout (2×2 grid):\n---------------------------------\n| True Negative  | False Positive |\n| (TN)           | (FP)           |\n|----------------|----------------|\n| False Negative | True Positive  |\n| (FN)           | (TP)           |\n---------------------------------\nCell colors:\n- TN, TP (correct predictions): green shades\n- FP, FN (errors): red shades\nEach cell shows:\n- The count\n- What the error means in plain English:\nFP: \"Predicted class 1, was actually class 0 (false alarm)\"\nFN: \"Predicted class 0, was actually class 1 (missed detection)\"\nAlso annotates: accuracy, precision, recall, F1 in a text box.\nWhat this teaches\n-----------------\nThe confusion matrix is THE fundamental tool for understanding classification\nerror. Students learn that accuracy alone is misleading (class imbalance),\nand that FP and FN have different real-world costs depending on the problem.",
        "parameters": [
          {
            "name": "X",
            "type": "array-like",
            "default": null,
            "required": true,
            "desc": "Input parameter `X`."
          },
          {
            "name": "y",
            "type": "array-like",
            "default": null,
            "required": true,
            "desc": "Input parameter `y`."
          },
          {
            "name": "display",
            "type": "bool",
            "default": "True",
            "required": false,
            "desc": "Input parameter `display`."
          }
        ],
        "returns": {
          "type": "matplotlib.figure.Figure",
          "desc": "Output of the plot_confusion_matrix function."
        },
        "raises": [],
        "warns": [],
        "internalSteps": [
          "Execute plot_confusion_matrix processing",
          "Render or return the output"
        ],
        "mathFormula": null,
        "example": "# 6. Plot the confusion matrix (TP, FP, TN, FN) at default 0.5 threshold\nfig = model.plot_confusion_matrix(X, y, display=False)\nfig.savefig('confusion_matrix.png')",
        "outputImage": "assets/outputs/logistic/plot_confusion_matrix.png"
      },
      "plot_decision_boundary": {
        "name": "plot_decision_boundary",
        "signature": "model.plot_decision_boundary(X, y, resolution: int = 200, display: bool = True)",
        "category": "visualization",
        "source": "linesight/regression/logistic/visualization/plot_decision_boundary.py",
        "shortDesc": "Visualize the decision boundary for a 2-feature logistic regression model.",
        "longDesc": "What is drawn\n-------------\n1. Background color field: blue region = model predicts class 0,\nred region = model predicts class 1.\nIntensity of color = confidence (probability distance from 0.5).\nThis is the \"Desmos-like\" visualization.\n2. The decision boundary: solid black line where P(y=1) = 0.5 exactly.\n3. Actual data points overlaid, colored by TRUE class (blue=0, red=1).\nMisclassified points get an X marker instead of a circle.",
        "parameters": [
          {
            "name": "X",
            "type": "array-like, shape (n, 2) — MUST be exactly 2 features",
            "default": null,
            "required": true,
            "desc": ""
          },
          {
            "name": "y",
            "type": "array-like, shape (n,) — binary labels 0 or 1",
            "default": null,
            "required": true,
            "desc": ""
          },
          {
            "name": "resolution",
            "type": "int, default 200",
            "default": "200",
            "required": false,
            "desc": "Grid points per axis. Higher = sharper boundary but slower. Use resolution=100 for animations."
          },
          {
            "name": "display",
            "type": "bool, default True",
            "default": "True",
            "required": false,
            "desc": ""
          }
        ],
        "returns": {
          "type": "matplotlib.figure.Figure",
          "desc": "Output of the plot_decision_boundary function."
        },
        "raises": [
          {
            "exception": "LineSightShapeError",
            "condition": "if X does not have exactly 2 features.",
            "message": ""
          }
        ],
        "warns": [],
        "internalSteps": [
          "Execute plot_decision_boundary processing",
          "Render or return the output"
        ],
        "mathFormula": null,
        "example": "# 4. View decision boundary line dividing class 0 and class 1 in 2D space\nfig = model.plot_decision_boundary(X, y, display=False)\nfig.savefig('decision_boundary.png')",
        "outputImage": "assets/outputs/logistic/plot_decision_boundary.png"
      },
      "plot_learning_curve": {
        "name": "plot_learning_curve",
        "signature": "model.plot_learning_curve(X, y, cv_splits: int = 5, train_sizes=None, display: bool = True)",
        "category": "visualization",
        "source": "linesight/regression/logistic/visualization/plot_learning_curve.py",
        "shortDesc": "Show how model performance changes as training dataset size grows.",
        "longDesc": "What is drawn\n-------------\n- X-axis: number of training samples used\n- Y-axis: R² score (or accuracy for logistic)\n- Blue line: training score at each dataset size\n- Red line: validation score at each dataset size\nWhat this teaches\n-----------------\n- If training score is high but validation score is low at ALL sizes:\nthe model is overfitting regardless of data size\n- If both scores are low and flat: the model is underfitting — more\ndata won't help, the model type is wrong\n- If validation score is rising and approaching training score as n grows:\ngetting more data WILL help\nAlgorithm\n---------\nFor each train_size in train_sizes:\n1. Take first train_size samples as training set\n2. Use the remaining as validation set\n3. Fit a temporary model on training set\n4. Score on both sets\n5. Repeat cv_splits times with different random subsets, take mean",
        "parameters": [
          {
            "name": "X",
            "type": "array-like",
            "default": null,
            "required": true,
            "desc": ""
          },
          {
            "name": "y",
            "type": "array-like",
            "default": null,
            "required": true,
            "desc": ""
          },
          {
            "name": "cv_splits",
            "type": "int, default 5",
            "default": "5",
            "required": false,
            "desc": "Number of random subsets to average for each train size. Higher = smoother curve but slower."
          },
          {
            "name": "train_sizes",
            "type": "list of int, optional",
            "default": null,
            "required": false,
            "desc": "Default: 10 evenly-spaced sizes from 10% to 90% of dataset."
          },
          {
            "name": "display",
            "type": "bool, default True",
            "default": "True",
            "required": false,
            "desc": ""
          }
        ],
        "returns": {
          "type": "matplotlib.figure.Figure",
          "desc": "Output of the plot_learning_curve function."
        },
        "raises": [],
        "warns": [],
        "internalSteps": [
          "Execute plot_learning_curve processing",
          "Render or return the output"
        ],
        "mathFormula": null,
        "example": "# Instantiate and train model\nmodel = LogisticRegression()\nmodel.fit(X, y)\n\n# Call method\nmodel.plot_learning_curve(X, y)",
        "outputImage": "assets/outputs/logistic/plot_learning_curve.png"
      },
      "plot_log_odds": {
        "name": "plot_log_odds",
        "signature": "model.plot_log_odds(X, y, display: bool = True)",
        "category": "visualization",
        "source": "linesight/regression/logistic/visualization/plot_log_odds.py",
        "shortDesc": "Show the three representations of logistic regression output.",
        "longDesc": "Three panels, all sharing the same x-axis (sample index sorted by z):\n-----------------------------------------------------------------------\nPanel 1: Linear score z = Xθ + b\n- Shows raw model output before sigmoid\n- Unbounded: can be any real number\n- Dashed line at z=0 (the decision threshold)\nPanel 2: Probability p = σ(z)\n- The sigmoid-transformed output\n- Bounded [0, 1]\n- Dashed line at p=0.5\n- Colored by TRUE class (red=class 1, blue=class 0)\n- Misclassified points marked with ×\nPanel 3: Log-odds = log(p / (1-p)) = z\n- Shows that log-odds IS the linear score (they are identical)\n- Dashed line at log-odds=0\nThe key insight: panels 1 and 3 are IDENTICAL because log(σ(z)/(1-σ(z))) = z.\nThe title states this explicitly.",
        "parameters": [
          {
            "name": "X",
            "type": "array-like, shape (n, p)",
            "default": null,
            "required": true,
            "desc": ""
          },
          {
            "name": "y",
            "type": "array-like, shape (n,)",
            "default": null,
            "required": true,
            "desc": ""
          },
          {
            "name": "display",
            "type": "bool, default True",
            "default": "True",
            "required": false,
            "desc": ""
          }
        ],
        "returns": {
          "type": "matplotlib.figure.Figure",
          "desc": "Output of the plot_log_odds function."
        },
        "raises": [],
        "warns": [
          {
            "warning": "LineSightDataWarning",
            "condition": "if n > 500:",
            "message": "\"plot_log_odds() on {n} samples may be slow to render. Consider plotting a subset.\" "
          }
        ],
        "internalSteps": [
          "Execute plot_log_odds processing",
          "Render or return the output"
        ],
        "mathFormula": null,
        "example": "# 10. Display the linear log-odds relationship vs target outputs\nfig = model.plot_log_odds(X, y, display=False)\nfig.savefig('log_odds.png')",
        "outputImage": "assets/outputs/logistic/plot_log_odds.png"
      },
      "plot_loss_curve": {
        "name": "plot_loss_curve",
        "signature": "model.plot_loss_curve(display: bool = True)",
        "category": "visualization",
        "source": "linesight/regression/logistic/visualization/plot_loss_curve.py",
        "shortDesc": "Method plot_loss_curve() of LogisticRegression.",
        "longDesc": "Method plot_loss_curve() of LogisticRegression.",
        "parameters": [
          {
            "name": "display",
            "type": "bool",
            "default": "True",
            "required": false,
            "desc": "Input parameter `display`."
          }
        ],
        "returns": {
          "type": "matplotlib.figure.Figure",
          "desc": "Output of the plot_loss_curve function."
        },
        "raises": [],
        "warns": [],
        "internalSteps": [
          "Execute plot_loss_curve processing",
          "Render or return the output"
        ],
        "mathFormula": null,
        "example": "# Instantiate and train model\nmodel = LogisticRegression()\nmodel.fit(X, y)\n\n# Call method\nmodel.plot_loss_curve(X, y)",
        "outputImage": "assets/outputs/logistic/plot_loss_curve.png"
      },
      "plot_probability_surface": {
        "name": "plot_probability_surface",
        "signature": "model.plot_probability_surface(X, y, display: bool = True)",
        "category": "visualization",
        "source": "linesight/regression/logistic/visualization/plot_probability_surface.py",
        "shortDesc": "3D scatter + sigmoid probability surface for 2-feature logistic models.",
        "longDesc": "3D scatter + sigmoid probability surface for 2-feature logistic models.",
        "parameters": [
          {
            "name": "X",
            "type": "array-like",
            "default": null,
            "required": true,
            "desc": "Input parameter `X`."
          },
          {
            "name": "y",
            "type": "array-like",
            "default": null,
            "required": true,
            "desc": "Input parameter `y`."
          },
          {
            "name": "display",
            "type": "bool",
            "default": "True",
            "required": false,
            "desc": "Input parameter `display`."
          }
        ],
        "returns": {
          "type": "matplotlib.figure.Figure",
          "desc": "Output of the plot_probability_surface function."
        },
        "raises": [],
        "warns": [],
        "internalSteps": [
          "Execute plot_probability_surface processing",
          "Render or return the output"
        ],
        "mathFormula": null,
        "example": "# 5. Display 3D probability surface showing predictions for all coordinates\nfig = model.plot_probability_surface(X, y, display=False)\nfig.savefig('probability_surface.png')",
        "outputImage": "assets/outputs/logistic/plot_probability_surface.png"
      },
      "plot_residuals": {
        "name": "plot_residuals",
        "signature": "model.plot_residuals(X, y, display: bool = True)",
        "category": "visualization",
        "source": "linesight/regression/logistic/visualization/plot_residuals.py",
        "shortDesc": "Method plot_residuals() of LogisticRegression.",
        "longDesc": "Method plot_residuals() of LogisticRegression.",
        "parameters": [
          {
            "name": "X",
            "type": "array-like",
            "default": null,
            "required": true,
            "desc": "Input parameter `X`."
          },
          {
            "name": "y",
            "type": "array-like",
            "default": null,
            "required": true,
            "desc": "Input parameter `y`."
          },
          {
            "name": "display",
            "type": "bool",
            "default": "True",
            "required": false,
            "desc": "Input parameter `display`."
          }
        ],
        "returns": {
          "type": "matplotlib.figure.Figure",
          "desc": "Output of the plot_residuals function."
        },
        "raises": [],
        "warns": [],
        "internalSteps": [
          "Execute plot_residuals processing",
          "Render or return the output"
        ],
        "mathFormula": null,
        "example": "# Instantiate and train model\nmodel = LogisticRegression()\nmodel.fit(X, y)\n\n# Call method\nmodel.plot_residuals(X, y)",
        "outputImage": "assets/outputs/logistic/plot_residuals.png"
      },
      "plot_roc_curve": {
        "name": "plot_roc_curve",
        "signature": "model.plot_roc_curve(X, y, display: bool = True)",
        "category": "visualization",
        "source": "linesight/regression/logistic/visualization/plot_roc_curve.py",
        "shortDesc": "Plot the ROC (Receiver Operating Characteristic) curve.",
        "longDesc": "What is drawn\n-------------\n- X-axis: False Positive Rate (FPR) = FP / (FP + TN)\n= \"of all actual negatives, what fraction did we incorrectly flag?\"\n- Y-axis: True Positive Rate (TPR) = TP / (TP + FN)\n= \"of all actual positives, what fraction did we correctly detect?\"\n- The curve sweeps all possible thresholds from 0 to 1\n- Diagonal dashed line = random classifier (AUC = 0.5)\n- AUC (Area Under Curve) annotated on the plot\nWhat this teaches\n-----------------\nThe ROC curve makes the FP/FN tradeoff visible: by choosing a lower\nthreshold, you catch more positives (higher TPR) but also get more false\nalarms (higher FPR). The right threshold depends on your problem:\n- Medical diagnosis: prefer high TPR (catch every sick patient), accept FP\n- Spam filter: prefer low FPR (don't lose real emails), accept FN\nAUC = 1.0 is perfect. AUC = 0.5 is useless. AUC < 0.5 means the model\nis literally backwards.\nAlgorithm\n---------\nFor 100 threshold values from 0 to 1:\nApply threshold to predict_proba()\nCompute FPR and TPR at that threshold\nPlot FPR vs TPR.\nAUC = area under this curve, computed via trapezoidal rule.",
        "parameters": [
          {
            "name": "X",
            "type": "array-like",
            "default": null,
            "required": true,
            "desc": "Input parameter `X`."
          },
          {
            "name": "y",
            "type": "array-like",
            "default": null,
            "required": true,
            "desc": "Input parameter `y`."
          },
          {
            "name": "display",
            "type": "bool",
            "default": "True",
            "required": false,
            "desc": "Input parameter `display`."
          }
        ],
        "returns": {
          "type": "matplotlib.figure.Figure",
          "desc": "Output of the plot_roc_curve function."
        },
        "raises": [],
        "warns": [],
        "internalSteps": [
          "Execute plot_roc_curve processing",
          "Render or return the output"
        ],
        "mathFormula": null,
        "example": "# 7. Render ROC curve and compute Area Under Curve (AUC)\nfig = model.plot_roc_curve(X, y, display=False)\nfig.savefig('roc_curve.png')",
        "outputImage": "assets/outputs/logistic/plot_roc_curve.png"
      },
      "plot_sigmoid": {
        "name": "plot_sigmoid",
        "signature": "model.plot_sigmoid(X, y, display: bool = True)",
        "category": "visualization",
        "source": "linesight/regression/logistic/visualization/plot_sigmoid.py",
        "shortDesc": "Method plot_sigmoid() of LogisticRegression.",
        "longDesc": "Method plot_sigmoid() of LogisticRegression.",
        "parameters": [
          {
            "name": "X",
            "type": "array-like",
            "default": null,
            "required": true,
            "desc": "Input parameter `X`."
          },
          {
            "name": "y",
            "type": "array-like",
            "default": null,
            "required": true,
            "desc": "Input parameter `y`."
          },
          {
            "name": "display",
            "type": "bool",
            "default": "True",
            "required": false,
            "desc": "Input parameter `display`."
          }
        ],
        "returns": {
          "type": "matplotlib.figure.Figure",
          "desc": "Output of the plot_sigmoid function."
        },
        "raises": [],
        "warns": [],
        "internalSteps": [
          "Execute plot_sigmoid processing",
          "Render or return the output"
        ],
        "mathFormula": null,
        "example": "# 3. Plot the logistic sigmoid curve mapping log-odds to probabilities\nfig = model.plot_sigmoid(display=False)\nfig.savefig('sigmoid.png')",
        "outputImage": "assets/outputs/logistic/plot_sigmoid.png"
      },
      "plot_threshold_sensitivity": {
        "name": "plot_threshold_sensitivity",
        "signature": "model.plot_threshold_sensitivity(X, y, display: bool = True)",
        "category": "visualization",
        "source": "linesight/regression/logistic/visualization/plot_threshold_sensitivity.py",
        "shortDesc": "Show how precision, recall, F1, and accuracy change as the classification",
        "longDesc": "threshold shifts from 0 to 1.\nWhat is drawn\n-------------\n- X-axis: threshold value (0 to 1)\n- Y-axis: metric value (0 to 1)\n- Four lines: accuracy (blue), precision (green), recall (red), F1 (purple)\n- Vertical dashed line at threshold=0.5 (the default)\n- Optional: vertical line at the threshold that maximizes F1\nWhat this teaches\n-----------------\nThe default threshold of 0.5 is arbitrary. This plot shows that:\n- Lowering the threshold: catches more positives (higher recall) but\nmore false alarms (lower precision)\n- Raising the threshold: fewer false alarms (higher precision) but\nmisses more positives (lower recall)\n- The right threshold depends on the cost of each error type.\nThis is advanced logistic regression intuition that most tutorials skip.",
        "parameters": [
          {
            "name": "X",
            "type": "array-like",
            "default": null,
            "required": true,
            "desc": "Input parameter `X`."
          },
          {
            "name": "y",
            "type": "array-like",
            "default": null,
            "required": true,
            "desc": "Input parameter `y`."
          },
          {
            "name": "display",
            "type": "bool",
            "default": "True",
            "required": false,
            "desc": "Input parameter `display`."
          }
        ],
        "returns": {
          "type": "matplotlib.figure.Figure",
          "desc": "Output of the plot_threshold_sensitivity function."
        },
        "raises": [],
        "warns": [],
        "internalSteps": [
          "Execute plot_threshold_sensitivity processing",
          "Render or return the output"
        ],
        "mathFormula": null,
        "example": "# 9. Plot classification metrics vs decision threshold choices\nfig = model.plot_threshold_sensitivity(X, y, display=False)\nfig.savefig('threshold_sensitivity.png')",
        "outputImage": "assets/outputs/logistic/plot_threshold_sensitivity.png"
      },
      "predict_proba": {
        "name": "predict_proba",
        "signature": "model.predict_proba(X) -> numpy.ndarray",
        "category": "core",
        "source": "linesight/regression/logistic/engine/predict_proba.py",
        "shortDesc": "Return probability of class 1 for each sample.",
        "longDesc": "Return probability of class 1 for each sample.",
        "parameters": [
          {
            "name": "X",
            "type": "array-like",
            "default": null,
            "required": true,
            "desc": "Input parameter `X`."
          }
        ],
        "returns": {
          "type": "self",
          "desc": "Output of the predict_proba function."
        },
        "raises": [],
        "warns": [],
        "internalSteps": [
          "Execute predict_proba processing",
          "Render or return the output"
        ],
        "mathFormula": null,
        "example": "# Instantiate and train model\nmodel = LogisticRegression()\nmodel.fit(X, y)\n\n# Call method\nmodel.predict_proba(X, y)",
        "outputImage": null
      }
    }
  }
}
};
